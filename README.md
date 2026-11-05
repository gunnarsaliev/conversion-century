# Syntax

Syntax is a [Tailwind Plus](https://tailwindcss.com/plus) site template built using [Tailwind CSS](https://tailwindcss.com) and [Next.js](https://nextjs.org).

## Getting started

To get started with this template, first install the npm dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Customizing

You can start editing this template by modifying the files in the `/src` folder. The site will auto-update as you edit these files.

## Global search

This template includes a global search that's powered by the [FlexSearch](https://github.com/nextapps-de/flexsearch) library. It's available by clicking the search input or by using the `⌘K` shortcut.

This feature requires no configuration, and works out of the box by automatically scanning your documentation pages to build its index. You can adjust the search parameters by editing the `/src/markdoc/search.mjs` file.

## License

This site template is a commercial product and is licensed under the [Tailwind Plus license](https://tailwindcss.com/plus/license).

## Learn more

To learn more about the technologies used in this site template, see the following resources:

- [Tailwind CSS](https://tailwindcss.com/docs) - the official Tailwind CSS documentation
- [Next.js](https://nextjs.org/docs) - the official Next.js documentation
- [Headless UI](https://headlessui.dev) - the official Headless UI documentation
- [Markdoc](https://markdoc.io) - the official Markdoc documentation
- [Algolia Autocomplete](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/what-is-autocomplete/) - the official Algolia Autocomplete documentation
- [FlexSearch](https://github.com/nextapps-de/flexsearch) - the official FlexSearch documentation
# conversion-century

## SEO

Metadata (canonical, hreflang, Open Graph), JSON-LD, `robots.txt` and `sitemap.xml` live in `src/lib/seo/`, `src/app/robots.ts` and `src/app/sitemap.ts`.

| Env var | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Optional override for the site origin (no trailing slash). Defaults to `https://www.cc-hub.online`. Used for canonical URLs, hreflang, sitemap and JSON-LD ids. |
| `SITE_INDEXABLE` | `true` lets search engines in. Anything else: `robots.txt` disallows everything and every page is `noindex`. |

Static page titles/descriptions are in the `Metadata` namespace of `messages/{bg,en}.json`; CMS pages use each document's **SEO** fields, falling back to its title/excerpt.

### Launch checklist

1. Set `SITE_INDEXABLE=true` on Vercel (Production only).
2. In the same deploy, remove `'website'` from `PROTECTED_SECTIONS` in `src/proxy.ts` so crawlers can reach `/website`.
3. Submit `/sitemap.xml` in Google Search Console and spot-check a blog post, event and job posting in the Rich Results Test.

## Weekly backups

Every Wednesday at 18:00 UTC, a Vercel Cron (`vercel.json`) calls `GET /api/backup-to-r2` (`src/endpoints/backupToR2.ts`). That is 21:00 Bulgarian time in summer and 20:00 in winter; on the Hobby plan it can start at any minute within that hour. It builds the same ZIP as the admin dashboard's **Export all data** button and stores it in a private R2 bucket as `backups/conversion-century-export-<timestamp>.zip`. Backups are never deleted.

| Env var | Purpose |
|---|---|
| `R2_BACKUP_BUCKET` | Private R2 bucket for backups. Keep public access off. It uses the same `R2_*` credentials and endpoint as media, so the API token needs read and write access to this bucket. |
| `CRON_SECRET` | Random string (`openssl rand -hex 32`). Vercel sends it to the cron route, and the route accepts nothing else. |

Manual backup: `curl -H "Authorization: Bearer $CRON_SECRET" "https://www.cc-hub.online/api/backup-to-r2"`

## Neon network transfer

The Neon free plan allows 5 GB of network transfer per project per month, and going over suspends the database until the next billing cycle. To stay under it:

- **Local dev uses a local Postgres.** Point `DATABASE_URL` in `.env.local` at it (it overrides `.env`). A Neon branch doesn't help, because the allowance is shared across the project.
- **Production migrations need the URL set explicitly:** `DATABASE_URL='<neon url>' pnpm migrate`. Plain `pnpm migrate` now targets the local database.
- **Public pages stay cached for a week** (`src/lib/cms/cache.ts`). Saving in the deployed admin refreshes them immediately. Scripts and direct SQL (`translations:import`, seeds) don't, so those changes appear after the next deploy or within a week.
- **Jobs run once a day** through a Vercel Cron on `GET /api/payload-jobs/run`, which needs `CRON_SECRET` or an admin session.

