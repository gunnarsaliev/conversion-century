import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { unstable_rethrow } from 'next/navigation'
import * as rootParams from 'next/root-params'

import { routing } from './routing'

// The [locale] root param. Unlike the request headers next-intl falls back
// to, it's known at build time, so pages using next-intl can be
// prerendered. It's not available in Server Actions or Route Handlers (or
// under the root layouts without [locale]), where this returns undefined.
async function rootLocale() {
  try {
    return await rootParams.locale()
  } catch (error) {
    unstable_rethrow(error)
    return undefined
  }
}

export default getRequestConfig(async ({ locale: override, requestLocale }) => {
  const requested = override ?? (await rootLocale()) ?? (await requestLocale)
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
