'use client'

import dynamic from 'next/dynamic'

import { useCurrentPageDataSelector } from '~/providers/page/CurrentPageDataProvider'

const PageLexicalRenderer = dynamic(() =>
  import('./PageLexicalRenderer').then((mod) => mod.PageLexicalRenderer),
)
const PageMarkdownRenderer = dynamic(() =>
  import('./PageMarkdownRenderer').then((mod) => mod.PageMarkdownRenderer),
)

export const PageMarkdown = () => {
  const contentFormat = useCurrentPageDataSelector(
    (data) => data?.contentFormat,
  )
  const content = useCurrentPageDataSelector((data) => data?.content)

  if (contentFormat === 'lexical' && content) {
    return <PageLexicalRenderer />
  }

  return <PageMarkdownRenderer />
}
