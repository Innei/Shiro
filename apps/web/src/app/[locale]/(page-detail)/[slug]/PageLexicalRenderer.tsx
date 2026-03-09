'use client'

import { MainLexicalContent } from '~/components/ui/rich-content/MainLexicalContent'
import { useCurrentPageDataSelector } from '~/providers/page/CurrentPageDataProvider'

export const PageLexicalRenderer = () => {
  const content = useCurrentPageDataSelector((data) => data?.content)
  if (!content) return null
  return <MainLexicalContent className="min-w-0 w-full" content={content} />
}
