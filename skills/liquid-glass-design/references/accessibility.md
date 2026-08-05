# Accessibility Gate

- Confirm text and controls remain legible over the darkest and lightest representative backgrounds.
- Preserve native button, link, input, and dialog semantics.
- Keep pointer targets at least 44 by 44 CSS pixels where touch is expected.
- Provide a visible keyboard focus indicator that is not conveyed by translucency alone.
- Honor `prefers-reduced-motion`, `prefers-reduced-transparency`, and forced colors.
- Verify the opaque fallback without `backdrop-filter`.
- Do not encode selection, warning, or disabled state only through blur, tint, or motion.
- Test zoom and text expansion for clipping caused by fixed glass dimensions.

Automated contrast tools can miss composited backgrounds. Pair automated checks with screenshots on representative content.
