'use client'

import { useTranslations } from 'next-intl'
import { useLayoutEffect, useRef, useState } from 'react'
import { onWaveTextClass } from '@/components/ui/textLinkStyles'

// Shared between the home's own footer and the menu overlay: a short rule above the credits, sized to
// track the text's own width (plus a bit) instead of a guessed fixed size, so it still fits when the
// phrase changes length between locales.
export function Credits() {
  const t = useTranslations('Footer')
  const ref = useRef<HTMLParagraphElement>(null)
  const [ruleWidth, setRuleWidth] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setRuleWidth(el.offsetWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div
        aria-hidden="true"
        style={ruleWidth ? { width: ruleWidth + 32 } : undefined}
        className="h-px w-12 bg-border [@media(min-aspect-ratio:17/20)]:dark:bg-white/25"
      />
      {/* The soft dark shadow darkens the wave just behind the letters, so the credits keep AAA contrast where the wave is lightest. */}
      <p
        ref={ref}
        className={`text-foreground/85 font-sans leading-7 tracking-wide [@media(min-aspect-ratio:17/20)]:dark:[text-shadow:0_0_6px_rgba(0,0,0,0.45),0_1px_2px_rgba(0,0,0,0.3)] ${onWaveTextClass}`}
      >
        {/* Weight only, no colour of its own: on the dark page's front wave the paragraph's cream (onWaveTextClass) must reach it. */}
        <span className="font-semibold">{t('credits')}</span> {t('copyright')}
      </p>
    </div>
  )
}
