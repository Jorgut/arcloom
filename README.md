# Jorgut Liquid Glass

A restrained Liquid Glass system for production React interfaces. The repository keeps executable UI code and Agent guidance together while preserving a clear boundary between them.

## Contents

- `packages/react`: `@jorgut/liquid-glass`, the React component library
- `skills/liquid-glass-design`: cross-platform Agent workflow for deciding, implementing, and reviewing glass interfaces
- `component-library.json`: discovery metadata for Skill Atlas and other catalogs

## When To Use It

Use this repository when you need glass UI that is controlled, accessible, and production-safe:

- translucent controls and floating navigation
- HMI or dashboard overlays
- Apple-style glass surfaces in React or Next.js
- review of existing glass effects for readability, contrast, motion, and fallback behavior

Do not use it when a plain solid surface would be clearer. The skill is allowed to recommend avoiding glass.

## Install

For the React component library:

```bash
npm install
```

For the Agent Skill, install or symlink [skills/liquid-glass-design](skills/liquid-glass-design) into your agent's skill directory.

Example prompt:

```text
Use liquid-glass-design to review this React navigation bar and decide whether glass is appropriate.
If it is, implement it with accessible fallbacks.
```

## Component Example

```tsx
import { LiquidGlass } from '@jorgut/liquid-glass';

export function Toolbar() {
  return (
    <LiquidGlass as="nav" intensity="medium">
      <button>Search</button>
      <button>Filters</button>
    </LiquidGlass>
  );
}
```

The component code is in [packages/react](packages/react). The skill instructions are in [skills/liquid-glass-design/SKILL.md](skills/liquid-glass-design/SKILL.md).

## Verify

```bash
npm install
npm run check
```

The component library remains the implementation source of truth. The Skill contains decision rules and verification steps, not a duplicate copy of the React source.

## Design Rules

- Keep text readable over the glass surface.
- Provide reduced-transparency and reduced-motion fallbacks.
- Avoid stacking multiple glass layers unless each layer has a distinct job.
- Test on light and dark backgrounds.
- Treat glass as a functional surface, not decoration.

## License

MIT
