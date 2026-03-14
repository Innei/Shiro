'use client'

import { createContext, use, useEffect, useState } from 'react'

const RichContentElementContext = createContext<HTMLElement | null>(null)

export function useRichContentElement() {
  return use(RichContentElementContext)
}

export function RichContentElementProvider({
  containerRef,
  children,
}: {
  containerRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
}) {
  const [el, setEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const contentEl = container.querySelector('.rich-content') as HTMLElement
    setEl(contentEl)
  }, [containerRef])

  return (
    <RichContentElementContext value={el}>{children}</RichContentElementContext>
  )
}
