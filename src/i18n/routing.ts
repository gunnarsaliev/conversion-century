import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'bg'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // No Accept-Language redirect on unprefixed URLs: crawlers (which send
  // no or English headers) and visitors alike get the URL they asked for.
  // Language switching is explicit, via the switcher and hreflang.
  localeDetection: false,
  // Bulgarian URLs for public sections (keys are the app/[locale] folder
  // paths, which en keeps). Anything not listed here (blog, legal, docs,
  // offers, login, …) is served at the same path in both locales.
  pathnames: {
    '/about': { en: '/about', bg: '/za-nas' },
    '/services': { en: '/services', bg: '/uslugi' },
    '/services/[slug]': { en: '/services/[slug]', bg: '/uslugi/[slug]' },
    '/solutions': { en: '/solutions', bg: '/resheniya' },
    '/solutions/[slug]': { en: '/solutions/[slug]', bg: '/resheniya/[slug]' },
    '/industries': { en: '/industries', bg: '/industrii' },
    '/industries/[slug]': { en: '/industries/[slug]', bg: '/industrii/[slug]' },
    '/case-studies': { en: '/case-studies', bg: '/kazusi' },
    '/case-studies/[slug]': { en: '/case-studies/[slug]', bg: '/kazusi/[slug]' },
    '/clients': { en: '/clients', bg: '/klienti' },
    '/reviews': { en: '/reviews', bg: '/otzivi' },
    '/open-positions': { en: '/open-positions', bg: '/svobodni-pozitsii' },
    '/careers/[slug]': { en: '/careers/[slug]', bg: '/kariera/[slug]' },
    '/book-a-consultation': {
      en: '/book-a-consultation',
      bg: '/zapazi-konsultatsiya',
    },
    '/events-and-media': { en: '/events-and-media', bg: '/sabitiya-i-media' },
    '/events-and-media/[slug]': {
      en: '/events-and-media/[slug]',
      bg: '/sabitiya-i-media/[slug]',
    },
    '/authors/[slug]': { en: '/authors/[slug]', bg: '/avtori/[slug]' },
  },
})
