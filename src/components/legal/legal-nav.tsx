'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type LegalNavProps = {
  label: string
  pages: { title: string; href: string }[]
}

export function LegalNav({ label, pages }: LegalNavProps) {
  const pathname = usePathname()

  return (
    <nav aria-label={label}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
        {pages.map((page) => {
          const isActive = pathname === page.href
          return (
            <li key={page.href} className="shrink-0">
              <Link
                href={page.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'block rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 font-semibold text-foreground'
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
