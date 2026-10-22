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

// Site sections that require a signed-in session: client offers are private
// (their pages read through the local API, which bypasses collection access).
// Payload issues its session as a `payload-token` cookie (default
// `${cookiePrefix}-token` name, see payload.config.ts's default
// `cookiePrefix: 'payload'`); its mere presence is enough for this
// route-level gate — the pages themselves still do the authoritative
// `payload.auth()` check server-side where it matters.
const PROTECTED_SECTIONS = ['offers', 'offer', 'special-offer']
const SESSION_COOKIE_NAME = 'payload-token'

// The dashboard's UI language is a per-browser preference (see
// lib/dashboard-locale), not part of the URL, so it lives at one unprefixed
// path. It bypasses next-intl's routing (whose locale detection would
// otherwise redirect /dashboard to /bg/dashboard) and is rewritten straight
// to the default-locale route segment.
const DASHBOARD_PATH = /^\/(?:([a-z]{2})\/)?dashboard(?=\/|$)(.*)$/

function loginRedirect(request: NextRequest, locale: string, target: string) {
  const loginPathname =
    locale === routing.defaultLocale ? '/login' : `/${locale}/login`
  const loginUrl = new URL(loginPathname, request.url)
  loginUrl.searchParams.set('redirect', target)
  return NextResponse.redirect(loginUrl)
}

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const dashboard = DASHBOARD_PATH.exec(pathname)
  if (dashboard) {
    const [, prefix, rest] = dashboard
    if (prefix && (routing.locales as readonly string[]).includes(prefix)) {
      return NextResponse.redirect(
        new URL(`/dashboard${rest}${search}`, request.url),
        308,
      )
    }
    if (!prefix) {
      if (!request.cookies.has(SESSION_COOKIE_NAME)) {
        return loginRedirect(request, routing.defaultLocale, pathname + search)
      }
      return NextResponse.rewrite(
        new URL(`/${routing.defaultLocale}${pathname}${search}`, request.url),
      )
    }
  }

  const response = handleI18nRouting(request)

  if (response.ok) {
    const rewritten = new URL(
      response.headers.get('x-middleware-rewrite') || request.url,
    )
    const [, locale, ...rest] = rewritten.pathname.split('/')

    if (
      PROTECTED_SECTIONS.includes(rest[0]) &&
      !request.cookies.has(SESSION_COOKIE_NAME)
    ) {
      return loginRedirect(request, locale, pathname + search)
    }

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
