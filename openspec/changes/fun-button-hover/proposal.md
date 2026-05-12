## Why

Button interactions across the site are currently consistent but plain. A fun hover effect on every button can make the project feel more lively and memorable while keeping existing behavior intact.

## What Changes

- Add a shared, fun hover effect that applies to all button-style controls across the site.
- Define keyboard-focus behavior so non-pointer users receive a comparable visual cue.
- Keep the enhancement presentation-only with no routing, API, or serverless logic changes.

## Capabilities

### New Capabilities

- `fun-button-hover`: Defines a reusable hover/focus interaction pattern applied to every button-style UI control.

### Modified Capabilities

## Impact

- Affected UI: shared button markup/styles in `index.html`, `404.html`, `css/style.css`, and `css/404.css`.
- Optional client script touchpoint: `js/404.mjs` only if behavior needs class toggling for accessibility parity.
- No changes to `netlify/functions/insult.mjs`, Netlify configuration, or dependencies.
