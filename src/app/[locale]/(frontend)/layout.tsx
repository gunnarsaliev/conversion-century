import { Providers } from '@/app/[locale]/(frontend)/providers'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}
