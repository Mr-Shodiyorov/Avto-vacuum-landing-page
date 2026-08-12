# Avto Vakum — Landing Page

Astro-built landing page for Avto Vakum, a 24/7 car detailing service in Qarshi (avto vakuum, kuzov kassa prav, palirovka, keramika). Built from the [Claude Design](https://claude.ai/design) mockup, static-rendered for performance and SEO, fully responsive (mobile + desktop).

## Structure

- `src/pages/index.astro` — page composition
- `src/components/` — Header, Hero, Services, BeforeAfter, WhyUs, Contact, Footer, MobileCta
- `src/layouts/Layout.astro` — document shell, SEO meta, JSON-LD (`AutoRepair` schema)
- `src/lib/site.ts` — single source of truth for phone numbers, socials, address, hours, nav links
- `src/styles/global.css` — design tokens (colors, fonts, spacing) and reset

Responsive breakpoint is `860px` (mobile-first, desktop layout applies above it).

## Before going live

- **Photos**: every `<ImagePlaceholder>` in Hero/BeforeAfter/Contact is a placeholder (no network request, no CLS). Swap them for real photography via `astro:assets` `<Image>` once available.
- **Address**: `site.address` in `src/lib/site.ts` still has bracketed placeholders (`[ko'cha nomi]`, `[uy raqami]`) — fill in the real street/building.
- **Domain**: `site: 'https://avtovakum.uz'` in `astro.config.mjs` and the sitemap URL in `public/robots.txt` are placeholders — update to the real domain.
- **OG image**: no `og:image`/social-share image is set yet (there's a `TODO` in `Layout.astro`'s JSON-LD). Add a real 1200×630 image and wire it into both `og:image` and the JSON-LD `image` field.

## Commands

| Command           | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`       | Install dependencies                        |
| `npm run dev`       | Start local dev server at `localhost:4321`  |
| `npm run build`     | Build production site to `./dist/`          |
| `npm run preview`   | Preview the production build locally        |
| `npm run astro check` | Type-check `.astro`/`.ts` files           |
