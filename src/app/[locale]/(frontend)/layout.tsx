import { type Metadata } from 'next'
import { Open_Sans, Lato } from 'next/font/google'
import clsx from 'clsx'

import { Providers } from '@/app/(frontend)/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

const inter = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-lexend',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Docs',
    default: 'CacheAdvance - Never miss the cache again.',
  },
  description:
    'Cache every single thing your app could ever do ahead of time, so your code never even has to run at all.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx('h-full antialiased', inter.variable, lexend.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full bg-white dark:bg-slate-900">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
