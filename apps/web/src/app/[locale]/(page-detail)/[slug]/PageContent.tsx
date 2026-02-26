import 'server-only'

import { PageMarkdownRenderer } from './PageMarkdownRenderer'

export function PageContent({
  contentFormat,
  content,
}: {
  contentFormat?: string
  content?: string | null
}) {
  return <PageMarkdownRenderer />
}
