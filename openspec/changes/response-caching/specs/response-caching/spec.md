## ADDED Requirements

### Requirement: Cache logic preserves handler order and security checks

The handler MUST keep the `AGENTS.md` order unchanged and place cache logic only after Step 5 (API key check), inside Step 6 (Groq call/fallback flow).

#### Scenario: Origin check still blocks before cache

- **WHEN** a request fails same-origin validation
- **THEN** the handler returns 403 and does not serve a cached roast

#### Scenario: Missing API key still returns existing fallback path

- **WHEN** the Groq API key is missing
- **THEN** the handler returns the existing fallback response before cache hit/miss behavior

### Requirement: Successful responses are cached with expiry

The handler SHALL cache successful Groq roast responses and reuse them only while the cache entry is valid.

#### Scenario: Cache hit avoids a second Groq call

- **WHEN** two matching requests occur within cache TTL
- **THEN** the second response is served from cache and does not trigger a new Groq request

#### Scenario: Expired cache entry refreshes from Groq

- **WHEN** a matching cache entry has expired
- **THEN** the handler fetches a fresh roast from Groq and replaces the expired entry

### Requirement: Fallback remains available on Groq failure

The handler MUST keep current fallback behavior for Groq failures and MUST NOT persist fallback text as a successful cache entry.

#### Scenario: Groq failure returns fallback without caching fallback text

- **WHEN** a cache miss occurs and Groq fails
- **THEN** the handler returns fallback and a subsequent matching request still attempts Groq again
