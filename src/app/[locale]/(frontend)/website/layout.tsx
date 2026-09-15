import { Providers } from '@/app/[locale]/(frontend)/providers'
import { Footer3 } from '@/components/footer3'
import { Navbar3 } from '@/components/navbar3'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Navbar3 />
        {children}
        <Footer3 />
      </div>
    </Providers>
  )
}
