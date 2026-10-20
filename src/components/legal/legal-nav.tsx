'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const LEGAL_PAGES = [
  { title: 'Terms and Conditions', href: '/legal/terms-and-conditions' },
  { title: 'Privacy Policy', href: '/legal/privacy-policy' },
  { title: 'Cookie Policy', href: '/legal/cookie-policy' },
]

export function LegalNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Legal">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Legal
      </p>
      <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
        {LEGAL_PAGES.map((page) => {
          const isActive = pathname === page.href
          return (
            <li key={page.href} className="shrink-0">
              <Link
                href={page.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'block rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-green-50 font-semibold text-green-800 dark:bg-green-950 dark:text-green-300'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {page.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
