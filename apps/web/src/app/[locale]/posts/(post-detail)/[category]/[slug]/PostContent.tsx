import { PostMarkdownRenderer } from './PostMarkdownRenderer'

export function PostContent({
  contentFormat,
  content,
}: {
  contentFormat?: string
  content?: string | null
}) {
  return <PostMarkdownRenderer />
}
