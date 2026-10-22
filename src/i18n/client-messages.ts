import type { AbstractIntlMessages } from 'next-intl'

// Message namespaces read by client components (`useTranslations` in a
// "use client" module or anything it imports). Only these are serialized to
// the browser; server components can read every namespace. A namespace
// missing here shows up as a MISSING_MESSAGE error in the browser console, so
// add it when a client component starts using a new one.
const CLIENT_NAMESPACES = [
  'Blog28',
  'Blogpost5',
  'Careers',
  'CaseStudies8',
  'Common',
  'Consultation',
  'Faq28',
  'Feature278',
  'Logos35',
  'Navbar',
  'Newsletter',
  'Reviews22',
  'Testimonial17',
  'Testimonial30',
  'TestimonialForm',
] as const

export function pickClientMessages(
  messages: AbstractIntlMessages,
): AbstractIntlMessages {
  return Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]),
  )
}
