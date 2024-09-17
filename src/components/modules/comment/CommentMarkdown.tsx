import type { FC } from 'react'

import type { MarkdownToJSX } from '~/components/ui/markdown'
import { Markdown } from '~/components/ui/markdown'
import { useTypeScriptHappyCallback } from '~/hooks/common/use-callback'

import { useCommentMarkdownContainerRefSetter } from './CommentProvider'

const disabledTypes = [
  'footnote',
  'footnoteReference',

  'htmlComment',
  'htmlSelfClosing',
  'htmlBlock',
] as MarkdownToJSX.RuleName[]

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
        disabledTypes={disabledTypes}
        disableParsingRawHTML
        forceBlock
        value={children}
      />
    </div>
  )
}
