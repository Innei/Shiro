import type { MarkdownToJSX } from '~/components/ui/markdown'
import type { FC } from 'react'

import { HighLighter } from '~/components/ui/code-highlighter'
import { Markdown } from '~/components/ui/markdown'

const disabledTypes = [
  'footnote',
  'footnoteReference',

  'image',

  'htmlComment',
  'htmlSelfClosing',
  'htmlBlock',
] as MarkdownToJSX.RuleName[]

export const CommentMarkdown: FC<{
  children: string
}> = ({ children }) => {
  return (
    <Markdown
      disabledTypes={disabledTypes}
      disableParsingRawHTML
      forceBlock
      value={children}
      extendsRules={{
        codeBlock: {
          react(node, output, state) {
            return (
              <HighLighter
                key={state?.key}
                content={node.content}
                lang={node.lang}
              />
            )
          },
        },
      }}
    />
  )
}
