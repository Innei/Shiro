import { NoteMarkdownRenderer } from './NoteMarkdownRenderer'

export function NoteContent({
  contentFormat,
  content,
}: {
  contentFormat?: string
  content?: string | null
}) {
  return <NoteMarkdownRenderer />
}
