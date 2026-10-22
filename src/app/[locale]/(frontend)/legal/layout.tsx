import WebsiteLayout from '@/app/[locale]/(site)/layout'
import { LegalNav } from '@/components/legal/legal-nav'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WebsiteLayout>
      <div className="flex flex-col gap-8 pt-12 lg:flex-row lg:gap-16 lg:pt-16">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <LegalNav />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </WebsiteLayout>
  )
}
