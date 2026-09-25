'use client'

import { useTranslations } from 'next-intl'
import { useLayoutEffect, useState } from 'react'
import { ArrowIcon } from '@/components/ui/ArrowIcon'
import { textLinkArrowClass, textLinkClass, textLinkLabelClass } from '@/components/ui/textLinkStyles'
import { usePathname } from '@/i18n/navigation'
import { Credits } from './Credits'
import { useContactLinks } from './useContactLinks'

export function Footer() {
  const t = useTranslations('Footer')
  const tHero = useTranslations('Hero')
  const contacts = useContactLinks()
  const pathname = usePathname()
  // The home's hero already carries the contact icons and a "back to top" would have nowhere below
  // it to come back from, so its footer is credits only.
  const isHome = pathname === '/'
  // A page short enough to fit the viewport has nowhere to scroll down from, so "back to top" would
  // do nothing. The Footer stays mounted across route changes (see layout.tsx), so this is re-checked
  // per pathname, on resize, and whenever the page's own content changes height (e.g. data loading in).
  const [scrollable, setScrollable] = useState(true)

  useLayoutEffect(() => {
    const check = () => setScrollable(document.documentElement.scrollHeight > window.innerHeight + 1)
    check()
    window.addEventListener('resize', check)
    const observer = new ResizeObserver(check)
    observer.observe(document.documentElement)
    return () => {
      window.removeEventListener('resize', check)
      observer.disconnect()
    }
  }, [pathname])

  // The home's hero already carries the contact icons, so its footer is just the credits under a
  // short centered rule, instead of a full-width border fighting the hero's own composition.
  if (isHome) {
    return (
      <footer className="py-8 short:py-4 text-base">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Credits />
        </div>
      </footer>
    )
  }

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
        {scrollable && (
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
        )}
      </div>
    </footer>
  )
}
