---
name: liquid-glass-design
description: Design, implement, and review restrained Liquid Glass interfaces in React or Next.js using production-safe semantics, accessibility fallbacks, motion constraints, and the @jorgut/liquid-glass component library when available. Use for translucent controls, floating navigation, glass surfaces, HMI overlays, or audits of glass effects; also use when deciding whether glass should be avoided.
---

# Liquid Glass Design

Build glass interfaces only when translucency communicates hierarchy over meaningful background content. Treat legibility, semantics, and fallbacks as requirements rather than polish.

## Workflow

1. Inspect the product context, target platforms, background content, interaction density, and accessibility requirements.
2. Decide whether glass is appropriate. Prefer an opaque surface for dense data, long-form text, safety-critical controls, low-power hardware, or unpredictable backgrounds.
3. Inspect the project before adding dependencies. If `@jorgut/liquid-glass` is already available, use its public API. If this repository is the workspace, use `packages/react`. Do not copy package source into the Skill.
4. Choose one primary glass layer. Avoid nested glass surfaces and large repeated glass grids.
5. Preserve native semantics. Use `LiquidGlassButton` for commands and `LiquidGlass` for a neutral surface; do not make a clickable `div`.
6. Verify opaque fallback, keyboard focus, 44px pointer targets, reduced motion, reduced transparency, forced colors, and unsupported backdrop filters.
7. Test on a visually representative background at narrow and wide viewports. Glass that works only on a demo gradient is not production-ready.

## Implementation

```tsx
import {
  LiquidGlass,
  LiquidGlassButton,
} from "@jorgut/liquid-glass";
import "@jorgut/liquid-glass/styles.css";

export function GlassControls() {
  return (
    <LiquidGlass interactive intensity="standard">
      <LiquidGlassButton>Confirm</LiquidGlassButton>
    </LiquidGlass>
  );
}
```

Keep business layout and spacing in the consuming application. Use the library for surface behavior, not as a page-layout system.

## Conditional References

- Read `references/visual-rules.md` when selecting intensity, layering, backgrounds, or motion.
- Read `references/accessibility.md` before shipping interactive or text-heavy glass UI.
- Read `references/hmi.md` for automotive, industrial, spatial-computing, or safety-relevant interfaces.

## Verification

Run the consuming project's tests, type check, and production build. For this repository, run:

```bash
npm run check
```

Use `accessibility-audit` for accessibility review and `review-animations` when pointer-responsive motion or transitions are present. Record unsupported browsers and hardware constraints instead of silently weakening the fallback.

## Boundaries

- Do not introduce canvas, WebGL, SVG displacement, or runtime shaders unless the user explicitly requires optical distortion and accepts the performance and compatibility cost.
- Do not use glass as decoration when it reduces contrast or information density.
- Do not claim Apple platform fidelity from a generic web implementation.
- Do not install or update packages without explicit confirmation.
