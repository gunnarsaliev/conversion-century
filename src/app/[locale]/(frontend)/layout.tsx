import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

import config from '@payload-config'
import { Providers } from '@/app/[locale]/(frontend)/providers'
import { Layout } from '@/components/Layout'

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  return (
    <Providers>
      <Layout isAdmin={user?.role === 'admin'}>{children}</Layout>
    </Providers>
  )
}
