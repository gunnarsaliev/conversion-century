'use client'

import { useTranslations } from 'next-intl'

// A client component so Link takes the locale from the provider; the
// server Link would read it from the request, which not-found can't.
import { Link } from '@/i18n/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Rendered inside the site layout (navbar + footer) for notFound() calls and,
// via [...rest], for unknown URLs. Next sends it with a 404 status and noindex.
export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <div className="flex flex-col items-center py-24 text-center md:py-32">
      <p className="text-sm font-semibold text-muted-foreground">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
        {t('heading')}
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
        {t('description')}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants({ size: 'lg' })}>
          {t('home')}
        </Link>
        <Link
          href="/services"
          className={buttonVariants({ size: 'lg', variant: 'outline' })}
        >
          {t('services')}
        </Link>
        <Link
          href="/blog"
          className={buttonVariants({ size: 'lg', variant: 'outline' })}
        >
          {t('blog')}
        </Link>
      </div>
    </div>
  )
}
