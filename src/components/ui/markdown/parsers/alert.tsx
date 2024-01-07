import clsx from 'clsx'
import { blockRegex, Priority } from 'markdown-to-jsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'

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
  NOTE: 'border-blue-500 dark:border-blue-400',
  IMPORTANT: 'border-accent',
  WARNING: 'border-amber-500 dark:border-amber-400',
} as any

const typedIconMap = {
  NOTE: IonInformation,
  IMPORTANT: FluentWarning28Regular,
  WARNING: FluentShieldError20Regular,
} as any

/**
 *
 * > [!NOTE]
 * > Highlights information that users should take into account, even when skimming.
 */
const ALERT_BLOCKQUOTE_R =
  /^(> \[!(?<type>NOTE|IMPORTANT|WARNING)\].*?)(?<body>(?:\n *>.*?)*)(?=\n{2,}|$)/

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
    const bodyClean = body.replace(/^> */gm, '')

    const typePrefix = type[0] + type.toLowerCase().slice(1)

    const Icon = typedIconMap[type] || typedIconMap.info
    return (
      <blockquote className={clsx(borderColorMap[type], 'not-italic')}>
        <span
          className={clsx(
            'text-semibold mb-1 inline-flex items-center',
            textColorMap[type],
          )}
        >
          <Icon
            className={clsx(
              `flex-shrink-0 text-3xl md:mr-2 md:self-start md:text-left`,
              typedIconMap[type] || typedIconMap.info,
            )}
          />

          {typePrefix}
        </span>
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
