import { docsPageMetadata } from '@/lib/seo/pages'

// Title/description from Dashboard → SEO → Meta data (falls back to
// messages/<locale>.json → Metadata.docsGettingStarted).
export async function generateMetadata() {
  return docsPageMetadata('docsGettingStarted')
}

export default function GettingStartedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
