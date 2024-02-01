import { useNodeViewContext } from '@prosemirror-adapter/react'
import { useEffect, useMemo, useRef } from 'react'
import { useForceUpdate } from 'framer-motion'
import type { MilkdownPlugin } from '@milkdown/ctx'
import type { NodeViewContext } from '@prosemirror-adapter/react'
import type { ModalContentPropsInternal } from '~/components/ui/modal'
import type { FC } from 'react'
import type { PluginCtx } from './types'

import { serializeAsJSON } from '@excalidraw/excalidraw'
import { schemaCtx } from '@milkdown/core'
import { codeBlockSchema } from '@milkdown/preset-commonmark'
import { $view } from '@milkdown/utils'

import { StyledButton } from '~/components/ui/button'
import { HighLighter } from '~/components/ui/code-highlighter'
import { Excalidraw } from '~/components/ui/excalidraw'
import { TextArea } from '~/components/ui/input'
import { useCurrentModal, useModalStack } from '~/components/ui/modal'
import { useUncontrolledInput } from '~/hooks/common/use-uncontrolled-input'

import { useEditorCtx } from '../ctx'

const CodeBlock = () => {
  const { node } = useNodeViewContext()

  const language = node.attrs.language
  const content = node.content.firstChild?.text || ''

  switch (language) {
    case 'excalidraw': {
      return <ExcalidrawBoard content={content} />
    }
  }

  return (
    <div className="my-4">
      <NormalCodeBlock content={content} language={language} />
    </div>
  )
}

const NormalCodeBlock: FC<{
  content: string
  language: string
}> = ({ content, language }) => {
  const nodeCtx = useNodeViewContext()

  const modalStack = useModalStack()

  const handleEdit = () => {
    const Content: FC<ModalContentPropsInternal> = () => {
      const [, getValue, ref] =
        useUncontrolledInput<HTMLTextAreaElement>(content)
      return (
        <div className="flex h-[450px] max-h-[80vh] w-[60ch] max-w-full flex-col">
          <TextArea defaultValue={content} className="flex-grow" ref={ref} />

          <SharedModalAction nodeCtx={nodeCtx} getValue={getValue} />
        </div>
      )
    }
    modalStack.present({
      title: 'Edit Code Block',
      content: Content,
    })
  }

  if (!content) {
    return (
      <div
        className="my-4 flex h-12 w-full max-w-full cursor-pointer rounded bg-slate-100 text-sm center dark:bg-neutral-800"
        onClick={handleEdit}
        contentEditable={false}
      >
        Empty Code Block, Click to edit
      </div>
    )
  }
  return (
    <div contentEditable={false} onClick={handleEdit}>
      <HighLighter content={content} lang={language} key={content} />
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

export const ExcalidrawBoard: FC<{ content: string }> = ({ content }) => {
  const modalStack = useModalStack()
  const nodeCtx = useNodeViewContext()

  const [forceUpdate, key] = useForceUpdate()
  useEffect(() => {
    forceUpdate()
  }, [content])

  const handleEdit = () => {
    const Content: FC<ModalContentPropsInternal> = () => {
      const valueRef = useRef<string | undefined>(content)
      const valueGetterRef = useRef(() => valueRef.current)
      return (
        <div className="flex h-full w-full flex-col">
          <Excalidraw
            className="h-full w-full flex-grow"
            data={JSON.parse(content)}
            viewModeEnabled={false}
            zenModeEnabled={false}
            onChange={(elements, appState, files) => {
              valueRef.current = JSON.stringify(
                JSON.parse(
                  serializeAsJSON(elements, appState, files, 'database'),
                ),
                null,
                0,
              )
            }}
          />

          <SharedModalAction
            getValue={valueGetterRef.current}
            nodeCtx={nodeCtx}
          />
        </div>
      )
    }
    modalStack.present({
      title: 'Excalidraw',
      max: true,
      content: Content,
    })
  }
  return (
    <div onClick={handleEdit} className="cursor-pointer">
      <Excalidraw
        className="pointer-events-none"
        showExtendButton={false}
        key={key}
        data={useMemo(() => JSON.parse(content || '{}'), [content])}
      />
    </div>
  )
}

const SharedModalAction: FC<{
  nodeCtx: NodeViewContext
  getValue(): string | undefined
}> = ({ nodeCtx, getValue }) => {
  const { getPos, view, node } = nodeCtx
  const { dismiss } = useCurrentModal()
  const ctx = useEditorCtx()

  const deleteNode = () => {
    const pos = getPos()
    if (!pos) return
    view.dispatch(view.state.tr.delete(pos, pos + node.nodeSize))
    dismiss()
  }
  return (
    <div className="mt-4 flex justify-end space-x-2">
      <StyledButton variant="secondary" onClick={deleteNode}>
        删除
      </StyledButton>
      <StyledButton
        onClick={() => {
          // set first firstChild text
          const pos = getPos()
          if (!pos) return
          const tr = view.state.tr

          const nextValue = getValue()!

          const nextNode = ctx!.get(schemaCtx).text(nextValue)

          tr.replaceWith(pos + 1, pos + node.nodeSize, nextNode)
          view.dispatch(tr)

          dismiss()
        }}
      >
        保存
      </StyledButton>
    </div>
  )
}
