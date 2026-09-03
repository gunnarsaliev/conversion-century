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

  // Re-fetch with depth so `profileImage` resolves to a populated Media
  // document (payload.auth() does not populate relationship depth).
  const fullUser = user
    ? await payload.findByID({
        collection: 'users',
        id: user.id,
        depth: 1,
      })
    : null

  return (
    <Layout isAdmin={user?.role === 'admin'} user={fullUser}>
      {children}
    </Layout>
  )
}
