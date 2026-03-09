'use client'

import dynamic from 'next/dynamic'

import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'

const PostLexicalRenderer = dynamic(() =>
  import('./PostLexicalRenderer').then((mod) => mod.PostLexicalRenderer),
)
const PostMarkdownRenderer = dynamic(() =>
  import('./PostMarkdownRenderer').then((mod) => mod.PostMarkdownRenderer),
)

export const PostMarkdown = () => {
  const contentFormat = useCurrentPostDataSelector(
    (data) => data?.contentFormat,
  )
  const content = useCurrentPostDataSelector((data) => data?.content)

  if (contentFormat === 'lexical' && content) {
    return <PostLexicalRenderer />
  }

  return <PostMarkdownRenderer />
}
