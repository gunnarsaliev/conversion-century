import { type Metadata } from 'next'

import { Providers } from '@/app/[locale]/(frontend)/providers'

export const metadata: Metadata = {
  title: {
    absolute: 'Sign In / Sign Up',
  },
  robots: { index: false, follow: false },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}
