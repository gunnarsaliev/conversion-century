'use client'

import { useParams } from 'next/navigation'

import { fromLocalizedPath, usePathname, useRouter, type Href } from './navigation'
import { routing } from './routing'

type Locale = (typeof routing.locales)[number]

// The current page's path in `locale`, from the <link rel="alternate"
// hreflang> every public page advertises (lib/seo/metadata). Detail pages
// have a slug per locale (utilities/localizedSlugField), so this is the only
// reliable source for the other language's URL.
function alternateHref(locale: Locale): Href | null {
  const link = document.querySelector<HTMLLinkElement>(
    `link[rel="alternate"][hreflang="${locale}"]`,
  )
  if (!link?.href) return null

  const { pathname } = new URL(link.href)
  const [, maybeLocale, ...rest] = pathname.split('/')
  const path = maybeLocale === locale ? `/${rest.join('/')}` : pathname
  return fromLocalizedPath(path, locale) ?? path
}

// Public pages list their translations as hreflang alternates; pages that
// list none (docs, dashboard, login) exist under the same path in every
// locale.
function hasAlternates() {
  return document.querySelector('link[rel="alternate"][hreflang]') !== null
}

// Sections whose listing page lives elsewhere.
const SECTION_PAGES: Record<string, string> = {
  '/careers': '/open-positions',
}

// The section a detail page belongs to: /blog/[slug] → /blog.
function parentPathname(pathname: string) {
  const parent = pathname.replace(/\/[^/]+$/, '') || '/'
  return SECTION_PAGES[parent] ?? parent
}

// Navigates to the current page in another locale. A page that isn't
// translated into that locale (no alternate for it) goes to its section
// instead of a 404. Pages without alternates keep the current route
// (usePathname() is the internal template, e.g. /services/[slug]) with the
// current params. next-intl's router updates the NEXT_LOCALE cookie, so the
// choice also sticks on unprefixed URLs.
export function useSwitchLocale() {
  const pathname = usePathname()
  const params = useParams() as Record<string, string | string[]>
  const router = useRouter()

  return (locale: Locale, options?: { scroll?: boolean }) => {
    const target =
      alternateHref(locale) ??
      (hasAlternates()
        ? parentPathname(pathname)
        : { pathname, params })
    router.replace(target, { ...options, locale })
  }
}
