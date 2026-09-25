'use client'

import { useTranslations } from 'next-intl'
import { useLayoutEffect, useRef, useState } from 'react'

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
      <div aria-hidden="true" style={ruleWidth ? { width: ruleWidth + 32 } : undefined} className="h-px w-12 bg-border" />
      <p ref={ref} className="text-muted font-sans">
        {t('credits')} {t('copyright')}
      </p>
    </div>
  )
}
