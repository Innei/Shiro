'use client'

import { MainLexicalContent } from '~/components/ui/rich-content/MainLexicalContent'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

export const NoteLexicalRenderer = () => {
  const content = useCurrentNoteDataSelector((data) => data?.data.content)
  if (!content) return null
  return (
    <MainLexicalContent className="mt-10" content={content} variant="note" />
  )
}
