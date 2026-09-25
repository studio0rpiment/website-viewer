# Pair Gallery

Minimal gallery of paired websites (e.g. a student's "slop" build vs. their "mcp+skill" build), rendered live in outlined cards, with a fullscreen carousel. Data lives in Supabase; the app runs read-only from `src/data/students.json` when no database is configured.

## Run

```
npm install
npm run dev
```

## Set up the database (once)

1. Create a free project at supabase.com.
2. SQL Editor → paste `supabase/schema.sql` → Run. This creates the tables, locks writes to the emails in `admins` (yours is seeded), and seeds the current showcase.
3. Project Settings → API: copy the URL and anon key into `.env.local` (see `.env.example`), and into Vercel → Settings → Environment Variables. Redeploy.
4. Authentication → URL Configuration: add your Vercel URL (and `http://localhost:5173`) to Redirect URLs so magic links come back to the app.

The anon key is safe in the browser — Row Level Security is what protects writes, not the key.

## Routes

| path            | what                                                    |
| --------------- | ------------------------------------------------------- |
| `/`             | front page: course title (`src/site.ts`) + showcases in due-date order, earliest first |
| `/:slug`        | a specific showcase                                     |
| `/edit`         | admin index — **not linked from anywhere**; sign in required |
| `/edit/new`     | create a showcase                                       |
| `/edit/:slug`   | edit a showcase                                         |

`vercel.json` rewrites everything except `/sites/*` to the app so these deep links work on Vercel.

## Editing

Open `/edit` and enter the password, then pick a showcase. The account is fixed to `ADMIN_EMAIL` in `src/components/SignIn.tsx`; its password is set in Supabase → Authentication → Users (no emails involved). Every field saves when you leave it (blur) or press Enter; Escape reverts. Rows have ↑ ↓ to reorder and × to remove; **+ add** appends a blank row. The header lists other showcases and **+ new showcase**. At the bottom, **delete this showcase** removes it and all its rows after an inline confirmation (uploaded images stay in the bucket). Only emails in the `admins` table can write — add a row there to let a TA in.

## Reusing for another assignment

`/edit/new` → title, slug, **one site** or **a pair** per student, the caption(s) shown under each card (for a pair: e.g. "slop" / "mcp+skill"), due date, term. All of it is editable later at `/edit/<slug>`.

### Images instead of sites

Any entry URL that ends in `.png`, `.jpg`, `.gif`, `.webp`, `.avif`, or `.svg` renders as an image rather than an iframe — cropped to the top in the card, shown whole in the carousel. In the editor, **+ add from images** takes a whole folder's worth of files at once — select them all, and each becomes a row named after its file (`Abigail.jpg` → Abigail) with the image uploaded. Each URL field also has an **upload** button that puts the file in the Supabase `uploads` bucket (public read, admin write; created by `schema.sql`) and fills the URL in. You can also paste any public image URL, or use `public/images/<file>.png` for images committed to the repo.

When every entry in a one-site showcase is an image, the gallery switches to a **flow** layout: tiles are packed 5px apart with a skyline algorithm (`src/lib/skyline.ts`) — each one drops into the lowest spot it fits, left to right, so there's no vertical slack between rows unless the shapes don't line up — with their longest side equal, names overlaid. Hover a tile for a **rotate** button — the tile's footprint turns with the image and its neighbours reflow around it (animated with the View Transitions API where supported). Anyone can rotate for their session; when you're signed in as admin the rotation is saved to the entry (`rot_a` / `rot_b`). The **+ / −** under the theme icon resize all tiles together (2rem steps, 8–48rem) under the same rules — the admin's setting is saved on the showcase (`tile`).

### claude.ai artifact links

`claude.ai/artifact/…` pages refuse to load inside an iframe. Save the artifact's HTML into `public/sites/<name>.html` and use `/sites/<name>.html` as the URL. Vite and Vercel serve `public/` as-is.

## Themes

`src/themes.ts` holds the palette. Default is **dark** (`#111613` bg / `#FFF7E6` line); **light** flips them. Add another entry to the `themes` object and it's available; the toolbar icon (moon/sun) flips between the dark and light modes. Always starts dark — nothing is persisted.

## Use

- Click a card → that site opens near-fullscreen, live and fully navigable, as one slide of a carousel through every site in order (entry by entry, a then b).
- Move by clicking the outer 5% of the screen on either side, with ←/→ keys, or a two-finger horizontal swipe over the margins (and over locally hosted sites in `public/sites/` — a swipe over a cross-origin site belongs to that site). It wraps.
- Click anywhere outside the site (or Esc) to return to the gallery.
- Each caption has an **open ↗** link in case a site refuses to render in an iframe (sites that send `X-Frame-Options` / a restrictive CSP show blank — that's the host's policy, not the app).
