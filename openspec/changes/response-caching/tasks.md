## 1. Red-first scenario tests

- [ ] 1.1 Add failing Vitest `it()` blocks for all five BDD scenarios in `specs/response-caching/spec.md` (one scenario per `it()`).

## 2. Testable cache helper functions

- [ ] 2.1 Add JSDoc-documented helpers in `netlify/functions/insult.mjs`: `makeCacheKey(request)`, `isCacheEntryFresh(entry, nowMs)`, `readCachedInsult(cache, key, nowMs)`, and `writeCachedInsult(cache, key, insult, nowMs, ttlMs)`.

## 3. Handler integration at the correct step

- [ ] 3.1 Integrate cache lookup/store only in Step 6 flow (after Step 5 API key check), without changing Steps 1-5 behavior.

## 4. Preserve fallback and security behavior

- [ ] 4.1 Keep existing fallback branches unchanged and ensure fallback text is never cached as a successful response.

## 5. Verification

- [ ] 5.1 Run `npm run test` and `npm run check` and fix issues before marking complete.
