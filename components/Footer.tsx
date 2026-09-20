'use client'

import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('Footer')

  return (
    <footer className="snap-end border-t border-border py-6 text-center text-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 sm:flex-row sm:justify-between sm:gap-8 sm:px-8">
        <p className="text-muted font-sans sm:text-left">
          {t('credits')} {t('copyright')}
        </p>
        <a
          href="#"
          className="inline-block text-muted font-sans transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={t('backToTop')}
        >
          {t('backToTop')}
        </a>
      </div>
    </footer>
  )
}
