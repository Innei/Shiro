'use client'

import { RuleType } from 'markdown-to-jsx'

import { MainMarkdown, type MarkdownToJSX } from '~/components/ui/markdown'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

const MarkdownRenderers: Partial<MarkdownToJSX.PartialRules> = {
  [RuleType.text]: {
    render(node: MarkdownToJSX.TextNode, _: any, state?: MarkdownToJSX.State) {
      return <span key={state?.key}>{node.text}</span>
    },
  },
}

export const NoteMarkdownRenderer = () => {
  const text = useCurrentNoteDataSelector((data) => data?.data.text)
  if (!text) return null
  return (
    <MainMarkdown
      className="mt-10"
      allowsScript
      renderers={MarkdownRenderers}
      variant="note"
      value={text}
    />
  )
}
