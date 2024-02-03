import { useNodeViewContext } from '@prosemirror-adapter/react'
import type { MilkdownPlugin } from '@milkdown/ctx'
import type { FC } from 'react'
import type { PluginCtx } from './types'

import { schemaCtx } from '@milkdown/core'
import { codeBlockSchema } from '@milkdown/preset-commonmark'
import { $view } from '@milkdown/utils'

import { CodeEditor } from '~/components/ui/code-editor'
import { Input } from '~/components/ui/input'

import { useEditorCtx } from '../ctx'

const CodeBlock = () => {
  const { node } = useNodeViewContext()

  const language = node.attrs.language
  const content = node.content.firstChild?.text

  return (
    <div className="my-4" contentEditable={false}>
      <NormalCodeBlock content={content || ''} language={language} />
    </div>
  )
}

const NormalCodeBlock: FC<{
  content: string
  language: string
}> = ({ content, language }) => {
  const nodeCtx = useNodeViewContext()
  const ctx = useEditorCtx()

  return (
    <div className="group relative">
      <CodeEditor
        ref={(el) => {
          if (!content && el)
            requestAnimationFrame(() => requestAnimationFrame(() => el.focus()))
        }}
        content={content}
        minHeight="20px"
        className="rounded-md border bg-gray-100 dark:bg-zinc-900"
        padding={8}
        language={language}
        onChange={(code) => {
          const view = nodeCtx.view

          const node = nodeCtx.node

          const pos = nodeCtx.getPos()
          const tr = view.state.tr
          if (typeof pos === 'undefined') return
          if (!code) {
            // remove node

            view.dispatch(view.state.tr.delete(pos, pos + node.nodeSize))
            return
          }

          const nextNode = ctx!.get(schemaCtx).text(code)

          tr.replaceWith(pos + 1, pos + node.nodeSize, nextNode)
          view.dispatch(tr)
        }}
      />
      <div className="absolute bottom-1 right-1 opacity-0 duration-200 group-hover:opacity-100">
        <Input
          defaultValue={language}
          onBlur={(e) => {
            const v = e.target.value
            nodeCtx.setAttrs({
              language: v,
            })
          }}
        />
      </div>
    </div>
  )
}
export const CodeBlockPlugin: (pluginCtx: PluginCtx) => MilkdownPlugin[] = ({
  nodeViewFactory,
}) => [
  $view(codeBlockSchema.node, () =>
    nodeViewFactory({
      component: CodeBlock,
    }),
  ),
]
