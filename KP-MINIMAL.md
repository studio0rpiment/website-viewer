# KP Minimal

The visual language this project uses. Reuse it by copying `src/themes.ts` and the token/label/control sections of `src/styles.css`.

**Color** — two colors per theme, everything else derived.
Dark (default): bg `#111613`, line `#FFF7E6`. Light: the same two, flipped.
`--muted` = line mixed 55% into bg; overlays = bg at 92%. Themes are entries in `src/themes.ts`; the app always starts dark, nothing persisted.

**Type** — system monospace (`ui-monospace, "SF Mono", Menlo, Consolas`). Body 0.8rem. Labels 0.75rem, lowercase, 0.04em tracking. Group/student names 0.9rem, uppercase, 0.08em tracking. All sizes in rem.

**Line** — 1px outlines, no fills, no shadows, no radius. Dashed for things waiting to be picked (gallery cards, inputs at rest); solid when active, hovered, or focused (open frame, focused input). Inputs are a bottom rule only.

**Controls** — text or outline icons, never boxed buttons. Icons are 1.5px stroke in `currentColor`, muted at rest, full line color on hover. Navigation prefers edge click-zones, gestures, and keys over visible chrome. Controls disappear when a view takes over (carousel hides the toolbar).

**Layout** — responsive `auto-fill` grids sized in rem; generous gaps (2–2.5rem); content sits on the bg with no panels or cards behind it.

**Behavior** — event-driven: save on blur/Enter, resize via ResizeObserver, no polling. Any timer gets a comment saying why.
