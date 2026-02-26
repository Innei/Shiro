'use client'

import dynamic from 'next/dynamic'

const PostMarkdownRenderer = dynamic(() =>
  import('./PostMarkdownRenderer').then((mod) => mod.PostMarkdownRenderer),
)

export const PostMarkdown = () => {
  return <PostMarkdownRenderer />
}
