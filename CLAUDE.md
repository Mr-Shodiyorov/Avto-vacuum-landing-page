## Development

Start the dev server in the background (it is long-running):

```
npm run dev
```

`npm run build` produces the static export in `out/`; serve that folder with any
static file server to preview the real production output.

## Architecture notes

- Static export (`output: 'export'` in `next.config.ts`) — the whole site is
  prerendered HTML, no Node server at runtime. `next/image` optimization is off
  for that reason; the hero art ships as a pre-made WebP.
- Styling is plain CSS, no CSS Modules: class names are BEM and globally unique,
  and each component imports its own co-located `*.css` file.
- Everything is a server component except `src/components/Motion.tsx`, which
  drives the scroll reveals and the stat count-up. Keep it that way — the page
  must be complete and readable without client JS.

## Documentation

Full documentation: https://nextjs.org/docs

Consult these guides before working on related tasks:

- [Adding pages, layouts, or route handlers](https://nextjs.org/docs/app/building-your-application/routing)
- [Server and client components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [Static exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Metadata and SEO](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Styling](https://nextjs.org/docs/app/building-your-application/styling)
- [Images](https://nextjs.org/docs/app/building-your-application/optimizing/images)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
