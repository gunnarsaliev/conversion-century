import { Providers } from '@/app/[locale]/(frontend)/providers'
import { Layout } from '@/components/Layout'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <Layout>{children}</Layout>
    </Providers>
  )
}
