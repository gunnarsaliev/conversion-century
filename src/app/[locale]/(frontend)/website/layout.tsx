import { Providers } from '@/app/[locale]/(frontend)/providers'
import { Navbar3 } from '@/components/navbar3'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="flex mx-auto max-w-9xl">
        <div className="flex-1">
          <Navbar3 />
          {children}
        </div>
      </div>
    </Providers>
  )
}
