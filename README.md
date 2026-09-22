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
| `/`             | the showcase flagged "show at /"                        |
| `/:slug`        | a specific showcase                                     |
| `/:slug/edit`   | its editor — **not linked from anywhere**; sign in required |
| `/new`          | create a showcase — same, URL only                      |

`vercel.json` rewrites everything except `/sites/*` to the app so these deep links work on Vercel.

## Editing

Open `/<slug>/edit` and enter the password. The account is fixed to `ADMIN_EMAIL` in `src/components/SignIn.tsx`; its password is set in Supabase → Authentication → Users (no emails involved). Every field saves when you leave it (blur) or press Enter; Escape reverts. Rows have ↑ ↓ to reorder and × to remove; **+ add** appends a blank row. The header lists other showcases and **+ new showcase**. Only emails in the `admins` table can write — add a row there to let a TA in.

## Reusing for another assignment

`/new` → give it a title, slug, and the two labels (they replace "slop" / "mcp+skill" under each card). Tick "show at /" in its editor if it should be the landing showcase.

### claude.ai artifact links

`claude.ai/artifact/…` pages refuse to load inside an iframe. Save the artifact's HTML into `public/sites/<name>.html` and use `/sites/<name>.html` as the URL. Vite and Vercel serve `public/` as-is.

## Themes

`src/themes.ts` holds the palette. Default is **dark** (`#111613` bg / `#FFF7E6` line); **light** flips them. Add another entry to the `themes` object and it's available; the toolbar icon (moon/sun) flips between the dark and light modes. Always starts dark — nothing is persisted.

## Use

- Click a card → that site opens near-fullscreen, live and fully navigable, as one slide of a carousel through every site in order (entry by entry, a then b).
- Move by clicking the outer 5% of the screen on either side, with ←/→ keys, or a two-finger horizontal swipe over the margins (and over locally hosted sites in `public/sites/` — a swipe over a cross-origin site belongs to that site). It wraps.
- Click anywhere outside the site (or Esc) to return to the gallery.
- Each caption has an **open ↗** link in case a site refuses to render in an iframe (sites that send `X-Frame-Options` / a restrictive CSP show blank — that's the host's policy, not the app).
