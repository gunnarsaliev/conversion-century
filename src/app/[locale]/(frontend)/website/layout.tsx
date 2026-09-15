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
      <div>
      <div className="flex mx-auto max-w-7xl">
        <div className="flex-1">
          <Navbar3 />
          {children}
        </div>
      </div>
      <Footer3 />
      </div>
    </Providers>
  )
}
