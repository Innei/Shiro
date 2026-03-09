'use client'

import { MainLexicalContent } from '~/components/ui/rich-content/MainLexicalContent'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'

export const PostLexicalRenderer = () => {
  const content = useCurrentPostDataSelector((data) => data?.content)
  if (!content) return null
  return <MainLexicalContent className="min-w-0 w-full" content={content} />
}
