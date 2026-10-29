import { notFound } from 'next/navigation'

// Unknown URLs under a locale would otherwise get Next's bare default 404.
// Calling notFound() here renders (site)/not-found.tsx with the site chrome.
export default function CatchAllPage() {
  notFound()
}
