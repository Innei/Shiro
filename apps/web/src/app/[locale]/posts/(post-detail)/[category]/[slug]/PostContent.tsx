import { PostLexicalRenderer } from './PostLexicalRenderer'
import { PostMarkdownRenderer } from './PostMarkdownRenderer'

export function PostContent({ contentFormat }: { contentFormat?: string }) {
  if (contentFormat === 'lexical') {
    return <PostLexicalRenderer />
  }
  return <PostMarkdownRenderer />
}
