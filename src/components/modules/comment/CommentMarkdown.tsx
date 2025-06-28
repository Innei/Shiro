import type { FC } from 'react'

import { Markdown, RuleType } from '~/components/ui/markdown'

const disabledTypes = [
  RuleType.footnote,
  RuleType.footnoteReference,
  RuleType.htmlComment,
  RuleType.htmlSelfClosing,
  RuleType.htmlBlock,
]

export const CommentMarkdown: FC<{
  children: string
}> = ({ children }) => (
  <Markdown
    disabledTypes={disabledTypes}
    disableParsingRawHTML
    forceBlock
    value={children}
  />
)
