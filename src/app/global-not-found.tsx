import type { Metadata } from 'next'
import Link from 'next/link'

import { SITE_NAME } from '@/lib/seo/site'

import '@/styles/tailwind.css'

// Served for URLs that match no route at all, i.e. outside [locale] (the
// locale proxy skips paths with a file extension). The request has no locale,
// so the page is bilingual. Bypasses every layout, hence the full document.
export const metadata: Metadata = {
  title: `404 – ${SITE_NAME}`,
  robots: { index: false },
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full items-center justify-center bg-white px-4 text-center text-slate-900 dark:bg-slate-900 dark:text-white">
        <main>
          <p className="text-sm font-semibold text-slate-500">404</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="mt-2 text-lg text-slate-500" lang="bg">
            Страницата не е намерена
          </p>
          <div className="mt-8 flex justify-center gap-6 text-sm font-medium underline underline-offset-4">
            <Link href="/">Go back home</Link>
            <Link href="/bg" lang="bg">
              Към началната страница
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
