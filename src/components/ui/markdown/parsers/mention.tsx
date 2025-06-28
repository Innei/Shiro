import type { MarkdownToJSX } from 'markdown-to-jsx'
import { Priority } from 'markdown-to-jsx'
import * as React from 'react'

import { SocialSourceLink } from '../../rich-link/SocialSourceLink'
import { allowInline } from '../utils/parser'

// [Innei]{GH@Innei} {TW@Innei} {TG@Innei}
export const MentionRule: MarkdownToJSX.Rule<{
  content: Record<string, string>
}> = {
  match: allowInline((source) => {
    return /^(\[(?<displayName>.*?)\])?\{((?<prefix>(GH)|(TW)|(TG))@(?<name>\w+\b))\}\s?(?!\[.*?\])/.exec(
      source,
    )
  }),
  order: Priority.LOW,
  parse(capture) {
    const { groups } = capture

    if (!groups) {
      return {
        content: {},
      }
    }
    return {
      content: { ...groups },
    }
  },
  render(result, _, state) {
    const { content } = result
    if (!content) {
      return null as any
    }

    const { prefix, name, displayName } = content
    if (!name) {
      return null as any
    }

    return (
      <SocialSourceLink
        name={displayName || name}
        source={prefix}
        key={state?.key}
      />
    )
  },
}
