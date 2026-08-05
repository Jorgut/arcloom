# @jorgut/liquid-glass

Internal React primitives for restrained translucent surfaces and controls.

This package borrows the visual idea of layered glass and pointer-responsive
highlights, but it does not copy `rdev/liquid-glass-react` code or use its
canvas/SVG displacement pipeline. The default path is CSS-only and includes
browser fallbacks, native button semantics, keyboard focus, reduced-motion,
reduced-transparency, and forced-colors behavior.

## Usage

```tsx
import {
  LiquidGlass,
  LiquidGlassButton,
} from "@jorgut/liquid-glass";
import "@jorgut/liquid-glass/styles.css";

export function Controls() {
  return (
    <LiquidGlass interactive>
      <p>Cabin temperature</p>
      <LiquidGlassButton onClick={() => console.log("confirmed")}>
        Confirm
      </LiquidGlassButton>
    </LiquidGlass>
  );
}
```

Use glass to express hierarchy over visually rich content. Avoid stacking
several translucent surfaces or using it for dense repeated rows. Critical HMI
controls still need a fully opaque fallback and hardware-specific validation.

## API

- `LiquidGlass`: non-interactive semantic-neutral surface (`div`)
- `LiquidGlassButton`: native `button` with a 44px minimum target
- `interactive`: enables pointer-responsive highlight; default `false` for the
  surface and `true` for the button
- `intensity`: `subtle`, `standard`, or `strong`

## Design constraints

- No render-time browser globals, so server rendering is safe.
- Pointer updates are coalesced with `requestAnimationFrame` and do not set
  React state.
- Touch input does not trigger hover-style movement.
- Unsupported `backdrop-filter` falls back to an opaque surface.
- User motion, transparency, and forced-color preferences override the effect.
- No experimental shader mode is included.
