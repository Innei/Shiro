import 'server-only'

import { PageLexicalRenderer } from './PageLexicalRenderer'
import { PageMarkdownRenderer } from './PageMarkdownRenderer'

export function PageContent({ contentFormat }: { contentFormat?: string }) {
  if (contentFormat === 'lexical') {
    return <PageLexicalRenderer />
  }
  return <PageMarkdownRenderer />
}
