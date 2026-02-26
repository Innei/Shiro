'use client'

import { MainMarkdown } from '~/components/ui/markdown'
import { useCurrentPageDataSelector } from '~/providers/page/CurrentPageDataProvider'

export const PageMarkdownRenderer = () => {
  const text = useCurrentPageDataSelector((data) => data?.text)
  if (!text) return null
  return (
    <MainMarkdown
      allowsScript
      value={text}
      className="min-w-0 overflow-hidden"
    />
  )
}
