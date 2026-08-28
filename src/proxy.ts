import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

import { routing } from '@/i18n/routing'

const handleI18nRouting = createMiddleware(routing)

// docs/technical-seo, docs/workflow, and docs/getting-started content is
// split into per-locale folders on disk (docs/<locale>/technical-seo/...,
// docs/<locale>/workflow/..., docs/<locale>/getting-started/...), but URLs
// stay locale-agnostic (/docs/technical-seo/..., /docs/getting-started).
// Rewrite requests for those paths to the folder matching the resolved locale.
const LOCALIZED_DOCS_SECTIONS = ['technical-seo', 'workflow', 'getting-started']

export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(request)

  if (response.ok) {
    const rewritten = new URL(
      response.headers.get('x-middleware-rewrite') || request.url,
    )
    const [, locale, ...rest] = rewritten.pathname.split('/')

    if (rest[0] === 'docs' && LOCALIZED_DOCS_SECTIONS.includes(rest[1])) {
      const localizedPathname = ['', locale, 'docs', locale, ...rest.slice(1)].join(
        '/',
      )
      return NextResponse.rewrite(new URL(localizedPathname, request.url), {
        headers: response.headers,
      })
    }
  }

  return response
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/admin`, `/tools`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|admin|tools|_next|_vercel|.*\\..*).*)',

    // However, always match the `robots.txt` doc page (a page slug, not a
    // static file) — it would otherwise be excluded by the dot above.
    '/:locale(bg|en)?/docs/technical-seo/robots.txt',
  ],
}
