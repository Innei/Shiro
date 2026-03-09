import { NoteLexicalRenderer } from './NoteLexicalRenderer'
import { NoteMarkdownRenderer } from './NoteMarkdownRenderer'

export function NoteContent({ contentFormat }: { contentFormat?: string }) {
  if (contentFormat === 'lexical') {
    return <NoteLexicalRenderer />
  }
  return <NoteMarkdownRenderer />
}
