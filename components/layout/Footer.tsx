'use client'

import { useTranslations } from 'next-intl'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import { textLinkArrowClass, textLinkClass, textLinkLabelClass } from '@/components/ui/textLinkStyles'
import { usePathname } from '@/i18n/navigation'
import { useContactLinks } from './useContactLinks'

export function Footer() {
  const t = useTranslations('Footer')
  const tHero = useTranslations('Hero')
  const contacts = useContactLinks()
  // The home is a single screen with nothing to scroll back from, and its hero carries the credits
  // itself, right under the contact icons (see Hero), so it has no footer.
  if (usePathname() === '/') return null

  return (
    <footer className="border-t border-border py-8 short:py-4 text-base">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 sm:px-8">
        <p className="order-2 text-muted font-sans sm:order-1">
          {t('credits')} {t('copyright')}
        </p>
        {contacts.length > 0 && (
          <ul className="order-1 flex flex-wrap gap-x-6 sm:order-2">
            {contacts.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  aria-label={link.external ? `${link.label} ${tHero('newTab')}` : link.label}
                  className={textLinkClass}
                >
                  <span className={textLinkLabelClass}>{link.label}</span>
                  <ArrowIcon className={textLinkArrowClass} />
                </a>
              </li>
            ))}
          </ul>
        )}
        <a
          href="#"
          className="order-3 hidden items-center gap-2 rounded-sm text-muted sm:inline-flex font-sans transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
      </div>
    </footer>
  )
}
