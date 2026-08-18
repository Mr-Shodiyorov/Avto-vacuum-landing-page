# Avto Vakum — Landing Page

Next.js landing page for Avto Vakum, a 24/7 car detailing service in Qarshi (avto vakuum, kuzov kassa prav, palirovka, keramika). Built from the [Claude Design](https://claude.ai/design) mockup, statically exported for performance and SEO, fully responsive (mobile + desktop).

## Structure

- `src/app/page.tsx` — page composition
- `src/app/layout.tsx` — document shell, SEO metadata, JSON-LD (`AutoRepair` schema)
- `src/app/sitemap.ts` / `src/app/robots.ts` — generated `sitemap.xml` and `robots.txt`
- `src/components/` — Header, Hero, Services, BeforeAfter, WhyUs, Contact, Footer, MobileCta, plus a co-located `*.css` file per component
- `src/components/Motion.tsx` — the only client component: scroll reveals + stat count-up
- `src/lib/site.ts` — single source of truth for phone numbers, socials, address, hours, nav links
- `src/styles/global.css` — design tokens (colors, fonts, spacing), reset, shared motion primitives

Responsive breakpoint is `860px` (mobile-first, desktop layout applies above it).

Styling deliberately uses plain global CSS rather than CSS Modules: class names are BEM and already unique, which keeps the markup identical to the design mockup.

## Deployment

`npm run build` writes a fully static site to `out/` (`output: 'export'`), which can be
uploaded to any static host — no Node runtime required. Because the export has no
image optimizer, `images.unoptimized` is on and the hero photo is committed as a
pre-sized WebP (`src/assets/usta-hero.webp`, generated from the `.png` source).

If the site ever needs server rendering (ISR, route handlers, `next/image`
optimization), drop `output: 'export'` and `images.unoptimized` from
`next.config.ts` and deploy to a Node host instead.

## Before going live

- **Photos**: every `<ImagePlaceholder>` in BeforeAfter/Contact is a placeholder (no network request, no CLS). Swap them for real photography via `next/image` once available.
- **Address**: `site.address` in `src/lib/site.ts` still has bracketed placeholders (`[ko'cha nomi]`, `[uy raqami]`) — fill in the real street/building.
- **Domain**: `site.url` in `src/lib/site.ts` (`https://www.avtovakum.uz`) feeds the canonical URL, sitemap and robots — update it to the real domain.
- **OG image**: no `og:image`/social-share image is set yet (there are `TODO`s in `src/app/layout.tsx`). Add a real 1200×630 image and wire it into both `openGraph.images` and the JSON-LD `image` field.

## Commands

| Command             | Action                                        |
| :------------------ | :-------------------------------------------- |
| `npm install`       | Install dependencies                          |
| `npm run dev`       | Start local dev server at `localhost:3000`    |
| `npm run build`     | Build the static site to `./out/`             |
| `npm run start`     | Serve the built `./out/` folder locally       |
| `npm run typecheck` | Type-check the project                        |
