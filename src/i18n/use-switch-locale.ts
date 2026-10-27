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

// Navigates to the current page in another locale. Falls back to the current
// route (usePathname() is the internal template, e.g. /services/[slug]) with
// the current params. next-intl's router updates the NEXT_LOCALE cookie, so
// the choice also sticks on unprefixed URLs.
export function useSwitchLocale() {
  const pathname = usePathname()
  const params = useParams() as Record<string, string | string[]>
  const router = useRouter()

  return (locale: Locale, options?: { scroll?: boolean }) => {
    const target = alternateHref(locale) ?? { pathname, params }
    router.replace(target, { ...options, locale })
  }
}
