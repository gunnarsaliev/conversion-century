import type { Endpoint } from 'payload'
import type { RedirectRule } from '../lib/seo/redirects'

// GET /api/seo-redirects — the enabled redirects as [{ from, to, statusCode }].
// Public: src/proxy.ts fetches it (no session) and caches it in memory, and
// the list only holds paths the site already answers with a redirect.
export const seoRedirects: Endpoint = {
  path: '/seo-redirects',
  method: 'get',
  handler: async (req) => {
    const { docs } = await req.payload.find({
      collection: 'redirects',
      where: { enabled: { equals: true } },
      select: { from: true, to: true, statusCode: true },
      depth: 0,
      pagination: false,
      overrideAccess: true,
    })

    const rules: RedirectRule[] = docs.map(({ from, to, statusCode }) => ({
      from,
      to,
      statusCode: statusCode ?? '301',
    }))

    return Response.json(rules, {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=30' },
    })
  },
}
