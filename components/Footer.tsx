'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('Footer')
  // The home is a single screen, so there is nothing to scroll back from.
  const isHome = usePathname() === '/'

  return (
    <footer className="border-t border-border py-8 text-center text-base">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 sm:px-8">
        <p className="text-muted font-sans">
          {t('credits')} {t('copyright')}
        </p>
        {!isHome && (
        <a
          href="#"
          className="inline-block text-muted font-sans transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={t('backToTop')}
        >
          {t('backToTop')}
        </a>
        )}
      </div>
    </footer>
  )
}
