## Context

`netlify/functions/insult.mjs` currently performs strict request validation and then calls Groq for roast generation with fallback handling. The handler order is explicitly defined in `AGENTS.md` and must not be restructured: (1) config, (2) method, (3) misconfig guard, (4) same-origin check, (5) API key check, (6) Groq call with fallback.

## Goals / Non-Goals

**Goals:**

- Reduce repeated outbound Groq calls for equivalent roast requests by caching successful responses.
- Keep all existing security checks and their order intact.
- Preserve existing fallback behavior on missing key and Groq failure.
- Make behavior straightforward to cover with Vitest one-scenario-per-`it()` tests.

**Non-Goals:**

- No CORS/origin policy changes.
- No reordering of handler steps from `AGENTS.md`.
- No persistent external cache dependency (in-memory cache only).

## Decisions

1. Insert cache lookup/store logic at **Step 6** only.
   - Slot: after Step 5 passes (API key exists), before outbound Groq request inside Step 6 flow.
   - Rationale: prevents cache from bypassing method, misconfig, or origin checks.
   - Alternative: cache lookup before security checks. Rejected as a security/order violation.

2. Cache only successful Groq roast responses.
   - Rationale: avoids pinning fallback text and allows automatic recovery after transient upstream issues.
   - Alternative: cache all responses including fallback. Rejected because fallback could become sticky.

3. Use TTL-based invalidation for cached entries.
   - Rationale: bounds staleness and keeps logic simple for deterministic tests.
   - Alternative: unbounded cache with no expiry. Rejected due to stale-response and memory risks.

4. Keep request-key derivation deterministic and scoped to roast generation inputs already used by the handler.
   - Rationale: ensures repeatable cache behavior and testability.
   - Alternative: broad/global key. Rejected due to collision risk.

## Risks / Trade-offs

- **In-memory cache resets on cold starts** -> Acceptable for this static-site/serverless context; optimization remains best-effort.
- **TTL too long may serve stale tone/style** -> Keep TTL configurable and conservative.
- **Cache growth over time** -> Restrict to TTL-based entries and prune opportunistically on reads/writes.
