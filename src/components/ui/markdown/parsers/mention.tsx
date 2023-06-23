import React from 'react'
import { Priority, simpleInlineRegex } from 'markdown-to-jsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'

import {
  CodiconGithubInverted,
  IcBaselineTelegram,
  MdiTwitter,
} from '~/components/icons/menu-collection'

const prefixToIconMap = {
  GH: <CodiconGithubInverted className="text-[#1D2127] dark:text-[#FFFFFF]" />,
  TW: <MdiTwitter className="text-[#1DA1F2]" />,
  TG: <IcBaselineTelegram className="text-[#2AABEE]" />,
}

const prefixToUrlMap = {
  GH: 'https://github.com/',
  TW: 'https://twitter.com/',
  TG: 'https://t.me/',
}

// {GH@Innei} {TW@Innei} {TG@Innei}
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

    // @ts-ignore
    const Icon = prefixToIconMap[prefix]
    // @ts-ignore
    const urlPrefix = prefixToUrlMap[prefix]

    return (
      <span
        className="mx-1 inline-flex items-center space-x-1 align-bottom"
        key={state?.key}
      >
        {Icon}
        <a
          target="_blank"
          rel="noreferrer nofollow"
          href={`${urlPrefix}${name}`}
          className="no-underline"
        >
          {displayName || name}
        </a>
      </span>
    )
  },
}
