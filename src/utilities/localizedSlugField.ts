import { slugField } from 'payload'
import slugify from 'slugify'

// Localized slug field generated from another field (e.g. `title`).
//
// `slugify`'s locale option transliterates Cyrillic (and other non-Latin
// scripts) to Latin characters rather than stripping them, so a Bulgarian
// title still produces a readable, URL-safe slug. Falls back to English
// rules for any other locale.
//
// Payload calls this on every save (including autosave/create before the
// source field has been entered, or when a locale's value is still blank),
// so `valueToSlugify` may be undefined — the `slugify` package throws on
// non-string input, so guard for that first.
export const localizedSlugField = (useAsSlug = 'title') =>
  slugField({
    useAsSlug,
    localized: true,
    position: 'sidebar',
    slugify: ({ valueToSlugify, req }) => {
      if (typeof valueToSlugify !== 'string' || valueToSlugify.trim().length === 0) {
        return undefined
      }

      return slugify(valueToSlugify, {
        lower: true,
        strict: true,
        locale: req.locale === 'bg' ? 'bg' : 'en',
      })
    },
  })
