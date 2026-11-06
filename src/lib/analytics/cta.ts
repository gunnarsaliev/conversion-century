// Stable CTA id from where it links to, for CTAs whose href comes from the CMS
// or props: "/book-a-consultation" → "book_a_consultation". Ids stay the same
// across languages and copy changes, so reports don't split. Links off the site
// are "external"; their address is in the event's `link_url`.
export function ctaId(href: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return 'external'
  const id = href
    .split(/[?#]/)[0]
    .replace(/^\/(en|bg)(?=\/|$)/, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-z0-9]+/gi, '_')
    .toLowerCase()
  return id || 'home'
}
