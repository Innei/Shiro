'use client'

import dynamic from 'next/dynamic'

import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

const NoteLexicalRenderer = dynamic(() =>
  import('./NoteLexicalRenderer').then((mod) => mod.NoteLexicalRenderer),
)
const NoteMarkdownRenderer = dynamic(() =>
  import('./NoteMarkdownRenderer').then((mod) => mod.NoteMarkdownRenderer),
)

export const NoteMarkdown = () => {
  const contentFormat = useCurrentNoteDataSelector(
    (data) => data?.data.contentFormat,
  )
  const content = useCurrentNoteDataSelector((data) => data?.data.content)

  if (contentFormat === 'lexical' && content) {
    return <NoteLexicalRenderer />
  }

  return <NoteMarkdownRenderer />
}
