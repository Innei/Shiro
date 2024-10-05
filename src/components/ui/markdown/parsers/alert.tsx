import clsx from 'clsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { blockRegex, Priority } from 'markdown-to-jsx'
import type { FC } from 'react'

import {
  FluentShieldError20Regular,
  FluentWarning28Regular,
  IonInformation,
} from '~/components/icons/status'

import { Markdown } from '../Markdown'

const textColorMap = {
  NOTE: 'text-blue-500 dark:text-blue-400',
  IMPORTANT: 'text-accent',
  WARNING: 'text-amber-500 dark:text-amber-400',
} as any

const borderColorMap = {
  NOTE: 'before:bg-blue-500 before:bg-blue-400',
  IMPORTANT: 'before:bg-accent',
  WARNING: 'before:bg-amber-500 dark:before:bg-amber-400',
} as any

const typedIconMap = {
  NOTE: IonInformation,
  IMPORTANT: FluentWarning28Regular,
  WARNING: FluentShieldError20Regular,
}

export const AlertIcon: FC<{
  type: keyof typeof typedIconMap
}> = ({ type }) => {
  const finalType = type || 'NOTE'
  const Icon = typedIconMap[finalType] || typedIconMap.NOTE
  const typePrefix = finalType[0] + finalType.toLowerCase().slice(1)

  return (
    <span
      className={clsx('mb-1 inline-flex items-center', textColorMap[finalType])}
    >
      <Icon
        className={clsx(
          `shrink-0 text-3xl md:mr-2 md:self-start md:text-left`,
          typedIconMap[finalType] || typedIconMap.NOTE,
        )}
      />

      {typePrefix}
    </span>
  )
}

/**
 *
 * > [!NOTE]
 * > Highlights information that users should take into account, even when skimming.
 */
const ALERT_BLOCKQUOTE_R =
  /^(> \[!(?<type>NOTE|IMPORTANT|WARNING)\].*)(?<body>(?:\n *>.*)*)(?=\n{2,}|$)/

export const AlertsRule: MarkdownToJSX.Rule = {
  match: blockRegex(ALERT_BLOCKQUOTE_R),
  order: Priority.HIGH,
  parse(capture) {
    return {
      raw: capture[0],
      parsed: {
        ...capture.groups,
      },
    }
  },
  react(node, output, state) {
    const { type, body } = node.parsed
    const bodyClean = body.replaceAll(/^> */gm, '')

    return (
      <blockquote
        className={clsx(borderColorMap[type], 'not-italic')}
        key={state.key}
      >
        <AlertIcon type={type as any} />
        <br />

        <Markdown
          allowsScript
          className="not-prose w-full [&>p:first-child]:mt-0"
        >
          {bodyClean}
        </Markdown>
      </blockquote>
    )
  },
}
