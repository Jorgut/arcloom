# Visual Rules

## Use Glass When

- A compact control floats over meaningful media, maps, video, or spatial content.
- Translucency helps preserve context while separating foreground controls.
- The surface is temporary, lightweight, and visually subordinate to the task.

## Prefer Opaque Surfaces When

- Rows, tables, forms, or long text require sustained reading.
- The background varies enough to make contrast unpredictable.
- Several translucent layers would overlap.
- Rendering budget, battery life, or remote-stream quality is constrained.

## Intensity

- `subtle`: low-density overlays on calm backgrounds.
- `standard`: default controls and compact panels.
- `strong`: visually busy backgrounds where more separation is needed.

Use one dominant glass plane. Place normal content inside it rather than adding a glass card for every child. Motion should communicate pointer position or pressed state, not make the material wobble continuously.
