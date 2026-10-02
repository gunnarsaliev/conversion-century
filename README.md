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
| `NEXT_PUBLIC_SITE_URL` | Production origin, e.g. `https://example.com` (no trailing slash). Used for canonical URLs, hreflang, sitemap and JSON-LD ids. Required when `SITE_INDEXABLE=true`. |
| `SITE_INDEXABLE` | `true` lets search engines in. Anything else: `robots.txt` disallows everything and every page is `noindex`. |

Static page titles/descriptions are in the `Metadata` namespace of `messages/{bg,en}.json`; CMS pages use each document's **SEO** fields, falling back to its title/excerpt.

### Launch checklist

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain and `SITE_INDEXABLE=true` on Vercel (Production only).
2. In the same deploy, remove `'website'` from `PROTECTED_SECTIONS` in `src/proxy.ts` so crawlers can reach `/website`.
3. Submit `/sitemap.xml` in Google Search Console and spot-check a blog post, event and job posting in the Rich Results Test.
