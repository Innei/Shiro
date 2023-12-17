import { memo } from 'react'
import { marked } from 'marked'

export const Markdown = memo((props: { value: string }) => {
  const { value } = props
  const html = marked(value)
  return (
    <article
      className="markdown-body text-sm"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
})
Markdown.displayName = 'Markdown'
