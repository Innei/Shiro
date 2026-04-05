import type { FC } from 'react'

import { Markdown, RuleType } from '~/components/ui/markdown'
import { useTypeScriptHappyCallback } from '~/hooks/common/use-callback'

import { useCommentMarkdownContainerRefSetter } from './CommentProvider'

const disabledTypes = [
  RuleType.footnote,
  RuleType.footnoteReference,
  RuleType.htmlComment,
  RuleType.htmlSelfClosing,
  RuleType.htmlBlock,
]

export const CommentMarkdown: FC<{
  children: string
}> = ({ children }) => {
  const setContainerRef = useCommentMarkdownContainerRefSetter()

  return (
    <div
      className="contents"
      ref={useTypeScriptHappyCallback(
        (ref) => setContainerRef(ref?.firstChild as HTMLDivElement),
        [setContainerRef],
      )}
    >
      <Markdown
        variant="comment"
        disabledTypes={disabledTypes}
        disableParsingRawHTML
        forceBlock
        value={children}
      />
    </div>
  )
}
