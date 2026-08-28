import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

import config from '@payload-config'
import { Layout } from '@/components/Layout'

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  return <Layout isAdmin={user?.role === 'admin'}>{children}</Layout>
}
