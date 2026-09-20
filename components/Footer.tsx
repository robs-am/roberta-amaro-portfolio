'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('Footer')
  // The home is a single screen, so there is nothing to scroll back from.
  const isHome = usePathname() === '/'

  return (
    <footer className="border-t border-border py-8 text-base">
      <div
        className={`mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-6 sm:px-8 ${
          isHome ? 'justify-center' : 'justify-between'
        }`}
      >
        <p className="text-muted font-sans">
          {t('credits')} {t('copyright')}
        </p>
        {!isHome && (
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-sm text-muted font-sans transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t('backToTop')}
            <svg
              viewBox="0 0 16 16"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
            </svg>
          </a>
        )}
      </div>
    </footer>
  )
}
