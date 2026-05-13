/* global process, Request, Response, setTimeout */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import handler, {
  isCacheEntryFresh,
  makeCacheKey,
  readCachedInsult,
  writeCachedInsult,
} from "../netlify/functions/insult.mjs";

const realFetch = globalThis.fetch;

describe("insult handler", () => {
  beforeEach(() => {
    process.env.NETLIFY_DEV = "true";
    delete process.env.SITE_URL;
    process.env.GROQ_API_KEY = "test-key";
    delete process.env.INSULT_CACHE_TTL_MS;
  });

  afterEach(() => {
    delete process.env.NETLIFY_DEV;
    delete process.env.SITE_URL;
    delete process.env.GROQ_API_KEY;
    delete process.env.INSULT_CACHE_TTL_MS;
    globalThis.fetch = realFetch;
  });

  it("Scenario: Origin check still blocks before cache", async () => {
    globalThis.fetch = async () => {
      throw new Error("fetch should not run for forbidden requests");
    };

    const req = new Request("http://localhost/.netlify/functions/insult?scenario=origin", {
      headers: { origin: "https://evil.example" },
    });
    const cacheKey = makeCacheKey(req);

    const res = await handler(req);
    expect(res.status).toBe(403);
    expect(typeof cacheKey).toBe("string");
  });

  it("Scenario: Missing API key still returns existing fallback path", async () => {
    delete process.env.GROQ_API_KEY;
    globalThis.fetch = async () => {
      throw new Error("fetch should not run when API key is missing");
    };

    const req = new Request("http://localhost/.netlify/functions/insult?scenario=missing-key", {
      headers: { origin: "http://localhost:8888" },
    });
    const cacheKey = makeCacheKey(req);
    const cached = readCachedInsult(new Map(), cacheKey, Date.now());

    const res = await handler(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.source).toBe("fallback");
    expect(typeof body.insult).toBe("string");
    expect(cached).toBeNull();
  });

  it("Scenario: Cache hit avoids a second Groq call", async () => {
    const responses = [
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "cached roast" } }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ];

    globalThis.fetch = async () => {
      const response = responses.shift();
      if (!response) {
        throw new Error("fetch called more than once");
      }
      return response;
    };

    const req = new Request("http://localhost/.netlify/functions/insult?scenario=cache-hit", {
      headers: { origin: "http://localhost:8888" },
    });

    const firstRes = await handler(req);
    const secondRes = await handler(req);
    const firstBody = await firstRes.json();
    const secondBody = await secondRes.json();

    expect(firstBody.insult).toBe("cached roast");
    expect(secondBody.insult).toBe("cached roast");
    expect(responses).toHaveLength(0);
  });

  it("Scenario: Expired cache entry refreshes from Groq", async () => {
    const entry = { insult: "cached roast", expiresAtMs: 1000 };
    const cache = new Map([["cache-key", entry]]);

    expect(isCacheEntryFresh(entry, 900)).toBe(true);
    expect(isCacheEntryFresh(entry, 1000)).toBe(false);
    expect(readCachedInsult(cache, "cache-key", 1001)).toBeNull();

    process.env.INSULT_CACHE_TTL_MS = "1";

    const responses = [
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "first fresh roast" } }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "second fresh roast" } }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ];

    globalThis.fetch = async () => {
      const response = responses.shift();
      if (!response) {
        throw new Error("fetch called more than twice");
      }
      return response;
    };

    const req = new Request("http://localhost/.netlify/functions/insult?scenario=expiry", {
      headers: { origin: "http://localhost:8888" },
    });

    const firstRes = await handler(req);
    await new Promise((resolve) => setTimeout(resolve, 5));
    const secondRes = await handler(req);
    const firstBody = await firstRes.json();
    const secondBody = await secondRes.json();

    expect(firstBody.insult).toBe("first fresh roast");
    expect(secondBody.insult).toBe("second fresh roast");
    expect(responses).toHaveLength(0);
  });

  it("Scenario: Groq failure returns fallback without caching fallback text", async () => {
    const cache = new Map();
    writeCachedInsult(cache, "prime", "cached roast", Date.now(), 10);
    expect(readCachedInsult(cache, "prime", Date.now())).toBe("cached roast");

    const responses = [
      new Response("{}", { status: 500 }),
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "recovered roast" } }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ];

    globalThis.fetch = async () => {
      const response = responses.shift();
      if (!response) {
        throw new Error("fetch called more than twice");
      }
      return response;
    };

    const req = new Request("http://localhost/.netlify/functions/insult?scenario=fallback", {
      headers: { origin: "http://localhost:8888" },
    });

    const firstRes = await handler(req);
    const secondRes = await handler(req);
    const firstBody = await firstRes.json();
    const secondBody = await secondRes.json();

    expect(firstBody.source).toBe("fallback");
    expect(secondBody.source).toBe("groq");
    expect(secondBody.insult).toBe("recovered roast");
    expect(responses).toHaveLength(0);
  });
});
