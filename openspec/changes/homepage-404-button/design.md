## Context

`index.html` is a static landing page with no JavaScript. The project’s primary interactive experience is the custom 404 page, but the homepage currently has no direct button that takes users there. The site already has reusable `.btn` styles and a CSP that favors simple semantic HTML over inline scripting.

## Goals / Non-Goals

**Goals:**

- Add a button that navigates to the custom 404 page.
- Keep implementation compatible with existing CSP and no-build architecture.
- Preserve current homepage structure and tone.

**Non-Goals:**

- No changes to `netlify/functions/insult.mjs` or API behavior.
- No new JavaScript or dependency additions.
- No redesign of homepage layout beyond adding the new button.

## Decisions

1. Add a semantic anchor styled as a button (`<a class="btn">`) instead of introducing JavaScript navigation.
   - Rationale: navigation is simple, keeps CSP-safe behavior, and matches existing styling patterns.
   - Alternative considered: JS click handler on a `<button>`. Rejected as unnecessary complexity for static navigation.

2. Point the link to a known invalid route (`/this-page-does-not-exist`) in the same tab.
   - Rationale: this guarantees the app reaches the real 404 flow via routing behavior instead of directly loading the 404 file.
   - Alternative considered: linking directly to `/404.html`. Rejected to keep the experience aligned with real not-found navigation.

3. Place the button in the main content area near the welcome section so it is discoverable without changing the existing card layout.
   - Rationale: this keeps the page structure stable while making the feature easy to find.
   - Alternative considered: placing it in the footer. Rejected because discoverability is weaker there.

## Risks / Trade-offs

- **Risk:** Minor layout shift on narrow screens if placement is awkward.  
  **Mitigation:** Reuse existing spacing utility classes and button style patterns already used in the site.
