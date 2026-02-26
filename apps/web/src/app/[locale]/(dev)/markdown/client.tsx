'use client'

import { Markdown } from '~/components/ui/markdown/Markdown'

export const MarkdownClient = (props: { children: string }) => {
  if (typeof window === 'undefined') {
    return null
  }

  return <Markdown>{props.children}</Markdown>
}
