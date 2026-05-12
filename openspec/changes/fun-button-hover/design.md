## Context

The site has button-style controls across multiple pages (`index.html` and `404.html`) with styles split between shared and page-specific CSS. The change needs a single interaction pattern that feels playful while remaining accessible for keyboard and reduced-motion users. The project uses static HTML/CSS with strict CSP, so styling-first implementation is preferred.

## Goals / Non-Goals

**Goals:**

- Define one reusable hover interaction pattern for all button-style controls.
- Ensure keyboard users get an equivalent visible interaction state.
- Respect reduced-motion preferences without removing visual clarity.

**Non-Goals:**

- No serverless/API behavior changes.
- No JavaScript-heavy animation system or new dependencies.
- No redesign of button copy, layout, or navigation behavior.

## Decisions

1. Implement the effect primarily in shared CSS selectors used by button-style controls.
   - Rationale: one place to enforce consistency across pages.
   - Alternative considered: page-specific duplicated styles in both CSS files. Rejected due to drift risk.

2. Treat hover and focus-visible as sibling interaction states with comparable prominence.
   - Rationale: keeps keyboard interaction parity with pointer hover.
   - Alternative considered: hover-only effect. Rejected for accessibility mismatch.

3. Provide a reduced-motion variant using media-query-driven style adjustments.
   - Rationale: preserves discoverability while minimizing animation.
   - Alternative considered: disabling all interaction cues under reduced motion. Rejected because it weakens affordance.

## Risks / Trade-offs

- **Cross-page selector mismatch** -> Audit existing button classes before implementation and consolidate where needed.
- **Overly playful motion can feel distracting** -> Keep duration and distance small and test against existing visual hierarchy.
- **Reduced-motion variant may diverge over time** -> Keep reduced-motion styles colocated with base interaction styles.
