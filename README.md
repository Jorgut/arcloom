# Jorgut Liquid Glass

A restrained Liquid Glass system for production React interfaces. The repository keeps executable UI code and Agent guidance together while preserving a clear boundary between them.

## Contents

- `packages/react`: `@jorgut/liquid-glass`, the React component library
- `skills/liquid-glass-design`: cross-platform Agent workflow for deciding, implementing, and reviewing glass interfaces
- `component-library.json`: discovery metadata for Skill Atlas and other catalogs

## Verify

```bash
npm install
npm run check
python3 /path/to/skill-creator/scripts/quick_validate.py skills/liquid-glass-design
```

The component library remains the implementation source of truth. The Skill contains decision rules and verification steps, not a duplicate copy of the React source.

## License

MIT
