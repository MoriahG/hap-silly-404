## Why

The 404 roast function can make repeated identical requests in short windows, which increases latency and external API usage. Adding response caching improves reliability and cost/performance while keeping the current security posture and fallback behavior intact.

## What Changes

- Add a server-side response cache for successful roast generations in `netlify/functions/insult.mjs`.
- Keep the existing security checks and handler order unchanged; cache logic is inserted in the Groq path **after Step 5 (API key check)** and **within Step 6 (Groq call flow)**.
- Preserve fallback behavior for all existing failure modes (missing key, upstream errors, invalid responses) and avoid cache-based bypasses of origin checks.
- Add Vitest coverage for cache hit, cache miss, TTL expiry, and fallback/security-order behaviors.

## Capabilities

### New Capabilities

- `response-caching`: Defines cache lookup/store behavior for roast responses without weakening security checks or fallback behavior.

### Modified Capabilities

## Impact

- Affected back-end code: `netlify/functions/insult.mjs`.
- Affected tests: `tests/` Vitest coverage for handler cache behavior and order-sensitive paths.
- No front-end markup/CSS changes and no new third-party dependencies required.
