## 1. Button selector unification

- [x] 1.1 In `index.html` and `404.html`, ensure every interactive button-style control uses the shared `.btn` class so one style rule can target all of them.
- [x] 1.2 In `css/style.css`, confirm `.btn` remains the canonical shared button selector and move any duplicate base button declarations from page-specific files into this shared rule.

## 2. Fun hover and focus implementation

- [x] 2.1 In `css/style.css`, add the new fun interaction styles to `.btn:hover` (e.g., playful transform/visual accent) so every `.btn` receives the same hover effect.
- [x] 2.2 In `css/style.css`, add matching `.btn:focus-visible` styles so keyboard users get an interaction cue with comparable prominence.
- [x] 2.3 In `css/style.css`, add an `@media (prefers-reduced-motion: reduce)` override for `.btn` interaction states to remove or minimize motion while keeping a visible state change.

## 3. Page-level reconciliation and verification

- [ ] 3.1 In `css/404.css`, remove or adjust any button hover/focus overrides that conflict with the shared `.btn` interaction styles.
- [ ] 3.2 Verify behavior on `index.html` and `404.html`: pointer hover triggers the fun effect, keyboard focus shows equivalent emphasis, and reduced-motion preference uses the reduced-motion variant.
- [ ] 3.3 Run `npm run check` and fix any lint/format/secretlint issues caused by the style changes.
