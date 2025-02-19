import type { MarkdownToJSX } from 'markdown-to-jsx'
import { Priority, simpleInlineRegex } from 'markdown-to-jsx'
import * as React from 'react'

import { SocialSourceLink } from '../../rich-link/SocialSourceLink'

// [Innei]{GH@Innei} {TW@Innei} {TG@Innei}
export const MentionRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(
    /^(\[(?<displayName>.*?)\])?\{((?<prefix>(GH)|(TW)|(TG))@(?<name>\w+\b))\}\s?(?!\[.*?\])/,
  ),
  order: Priority.MIN,
  parse(capture) {
    const { groups } = capture

    if (!groups) {
      return {}
    }
    return {
      content: { ...groups },
      type: 'mention',
    }
  },
  react(result, _, state) {
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
