'use client'

import dynamic from 'next/dynamic'

const NoteMarkdownRenderer = dynamic(() =>
  import('./NoteMarkdownRenderer').then((mod) => mod.NoteMarkdownRenderer),
)

export const NoteMarkdown = () => {
  return <NoteMarkdownRenderer />
}
