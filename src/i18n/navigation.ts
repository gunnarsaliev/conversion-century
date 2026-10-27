import { createElement, useMemo, type ComponentProps } from 'react'
import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

const navigation = createNavigation(routing)

type Locale = (typeof routing.locales)[number]
type Params = Record<string, string | string[]>
type NavigationHref = Parameters<typeof navigation.getPathname>[0]['href']

// Hrefs across the app are plain strings ("/services/seo"). With localized
// `pathnames`, next-intl only translates dynamic routes when given
// `{ pathname: '/services/[slug]', params }`, so the wrappers below convert
// matching strings to that form and let everything else through untouched.
export type Href = string | { pathname: string; params?: Params }

function matcher(template: string) {
  const names: string[] = []
  const source = template.replace(/\[([^\]]+)\]/g, (_, name: string) => {
    names.push(name)
    return '([^/]+)'
  })
  const regex = new RegExp(`^${source}$`)
  return (path: string): Params | null => {
    const match = regex.exec(path)
    if (!match) return null
    return Object.fromEntries(
      names.map((name, i) => [name, decodeURIComponent(match[i + 1])]),
    )
  }
}

const ROUTES = Object.entries(routing.pathnames).map(([pathname, localized]) => ({
  pathname,
  internal: matcher(pathname),
  localized: Object.fromEntries(
    routing.locales.map((locale) => [locale, matcher(localized[locale])]),
  ) as Record<Locale, ReturnType<typeof matcher>>,
}))

// Internal string path ("/services/seo") → navigation href.
// Paths with a query or hash are left as strings.
export function toHref(href: Href): NavigationHref {
  if (typeof href === 'string' && href.startsWith('/') && !/[?#]/.test(href)) {
    for (const route of ROUTES) {
      const params = route.internal(href)
      if (params) return { pathname: route.pathname, params } as NavigationHref
    }
  }
  return href as NavigationHref
}

// Public path in `locale` without its locale prefix ("/uslugi/seo" in bg)
// → navigation href, or null if it isn't a localized route.
export function fromLocalizedPath(path: string, locale: Locale): Href | null {
  for (const route of ROUTES) {
    const params = route.localized[locale](path)
    if (params) return { pathname: route.pathname, params }
  }
  return null
}

type LinkProps = Omit<ComponentProps<typeof navigation.Link>, 'href'> & {
  href: Href
}

export function Link({ href, ...props }: LinkProps) {
  return createElement(navigation.Link, {
    ...props,
    href: toHref(href),
  } as ComponentProps<typeof navigation.Link>)
}

type WithHref<T> = Omit<T, 'href'> & { href: Href }
type GetPathnameArgs = Parameters<typeof navigation.getPathname>[0]
type RedirectArgs = Parameters<typeof navigation.redirect>[0]

export function getPathname({ href, ...rest }: WithHref<GetPathnameArgs>) {
  return navigation.getPathname({ ...rest, href: toHref(href) } as GetPathnameArgs)
}

export function redirect({ href, ...rest }: WithHref<RedirectArgs>): never {
  return navigation.redirect({ ...rest, href: toHref(href) } as RedirectArgs)
}

export function useRouter() {
  const router = navigation.useRouter()
  return useMemo(
    () => ({
      ...router,
      push: (href: Href, options?: Parameters<typeof router.push>[1]) =>
        router.push(toHref(href) as Parameters<typeof router.push>[0], options),
      replace: (href: Href, options?: Parameters<typeof router.replace>[1]) =>
        router.replace(
          toHref(href) as Parameters<typeof router.replace>[0],
          options,
        ),
      prefetch: (href: Href, options?: Parameters<typeof router.prefetch>[1]) =>
        router.prefetch(
          toHref(href) as Parameters<typeof router.prefetch>[0],
          options,
        ),
    }),
    [router],
  )
}

export const { usePathname } = navigation
