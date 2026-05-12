## Why

The homepage currently does not give visitors a clear way to reach the custom 404 experience, which is the core feature of this project. Adding a dedicated button to navigate to the 404 page makes the feature discoverable and supports the assignment flow.

## What Changes

- Add a visible button on `index.html` that links to a known invalid route so Netlify serves the custom 404 page.
- Define placement expectations so the button is easy to find without changing the overall page structure.
- Keep behavior simple: standard in-site navigation (no script-based navigation required).

## Capabilities

### New Capabilities

- `homepage-404-button`: The homepage includes a button that navigates to the custom 404 page.

### Modified Capabilities

## Impact

- Affected UI: `index.html`.
- Potential styling touchpoint: shared button styles in `css/style.css` if needed for visual consistency.
- No API, serverless function, or dependency changes.
