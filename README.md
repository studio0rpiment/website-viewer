# Pair Gallery

Minimal gallery of student homework site pairs (slop vs. mcp+skill), rendered live in outlined cards.

## Run

```
npm install
npm run dev
```

## Add students

Edit `src/data/students.json` — one object per student:

```json
{ "name": "Ada Lovelace", "slop": "https://…", "mcp": "https://…" }
```

The app regroups and reorders everything from that file; nothing else needs to change.

### claude.ai artifact links

`claude.ai/artifact/…` pages refuse to load inside an iframe, so they can't be linked directly. Instead, save the artifact's HTML into `public/sites/<student>-slop.html` (open the artifact → download / copy the HTML) and point the JSON at `/sites/<student>-slop.html`. Vite serves `public/` as-is, so the local copy renders in the cards exactly like any other site.

## Themes

`src/themes.ts` holds the palette. Default is **dark** (`#111613` bg / `#FFF7E6` line); **light** flips them. Add another entry to the `themes` object and it's available; the toolbar toggle (moon/sun outline icon) flips between the dark and light modes. Always starts dark — nothing is persisted.

## Use

- Click a card → that site opens near-fullscreen, live and fully navigable (scroll, click, etc.), as one slide of a carousel through every site in order (student by student, slop then mcp+skill).
- Move by clicking the outer 5% of the screen on either side, with ←/→ keys, or a two-finger horizontal swipe over the margins (and over locally hosted sites in `public/sites/` — a swipe over a cross-origin site belongs to that site). It wraps: past the last site comes the first. A swipe over the site itself scrolls the site, not the carousel — the embedded page owns its own pointer events.
- Click anywhere outside the site (or Esc) to return to the gallery.
- Each caption has an **open ↗** link in case a site refuses to render in an iframe (sites that send `X-Frame-Options` / a restrictive CSP will show blank — that's the host's policy, not the app).
