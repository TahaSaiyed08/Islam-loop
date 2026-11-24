# Deploying to Vercel

The site needs no environment variables, no database and no build step beyond `pnpm build`.

## Steps

1. Import the repo. In Vercel choose *Add New… → Project*, then pick `TahaSaiyed08/Islam-loop` (or whatever the repo is called now).
2. Settings. Framework preset: Next.js (detected automatically). Build command `pnpm build`, install command `pnpm install`, output directory left as the default. Leave environment variables empty.
3. Production branch. The work was pushed to `claude/the-roadmap-website-djd0th`. Merge it to `main` first, or set that branch as the production branch.
4. Deploy. Click Deploy.
5. Custom domain (optional). *Settings → Domains → Add*, then follow the DNS instructions. Optionally set `NEXT_PUBLIC_SITE_URL` to the final address (for example `https://roadmap.example.org`) so the sitemap, canonical links and structured data use it. Without it, the site falls back to Vercel's production URL.

## Static hosting instead

```bash
DEPLOY_TARGET=static pnpm build      # writes the site to out/
# or, to serve under a sub-path:
DEPLOY_TARGET=static BASE_PATH=/roadmap pnpm build
```

Upload `out/` to any static host (GitHub Pages, Netlify, S3, Cloudflare Pages). Pages are written as folders (`trailingSlash`), so no rewrite rules are needed. Set `NEXT_PUBLIC_SITE_URL` at build time for correct sitemap URLs.

## Before you go live

- Run `pnpm verify` on a machine that can read Al-Islam.org (see README, "Verifying quotes") and review the result in `docs/verify-report.md`.
- Only lessons marked `PREVIEW` or `APPROVED` appear. Set `APPROVED` by hand in `content/tier-*.json` once you have read a lesson against its source.

## Adding accounts or a database later

All progress goes through the `ProgressStore` interface in `lib/progress.ts`, wrapped by `store/use-progress.ts`. To add accounts:

1. Write a second class that implements `ProgressStore` (for example `ServerProgressStore`, calling your API or database). If it needs async calls, make the interface methods return promises and update `store/use-progress.ts`, the only place that calls them.
2. Swap the one line `const backend = new LocalProgressStore()` in `store/use-progress.ts`.
3. Optionally keep `LocalProgressStore` as the signed-out fallback and merge on sign-in.

No component talks to localStorage directly, so nothing else changes. When you add a server, also remove `output: "export"` use (static builds cannot run server code) and add any new environment variables in Vercel's project settings.
