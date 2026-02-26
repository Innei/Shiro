'use client'

import dynamic from 'next/dynamic'

const PageMarkdownRenderer = dynamic(() =>
  import('./PageMarkdownRenderer').then((mod) => mod.PageMarkdownRenderer),
)

export const PageMarkdown = () => {
  return <PageMarkdownRenderer />
}
