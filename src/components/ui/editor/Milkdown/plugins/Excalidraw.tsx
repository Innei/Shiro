import { useNodeViewContext } from '@prosemirror-adapter/react'
import { lazy, Suspense, useEffect, useMemo, useRef } from 'react'
import { useForceUpdate } from 'framer-motion'
import { visit } from 'unist-util-visit'
import type { MilkdownPlugin } from '@milkdown/ctx'
import type { Node } from '@milkdown/transformer'
import type { ModalContentPropsInternal } from '~/components/ui/modal'
import type { FC } from 'react'
import type { PluginCtx } from './types'

import { setBlockType } from '@milkdown/prose/commands'
import { InputRule } from '@milkdown/prose/inputrules'
import {
  $command,
  $inputRule,
  $nodeSchema,
  $remark,
  $view,
} from '@milkdown/utils'

import { BlockLoading } from '~/components/modules/shared/BlockLoading'
import { useModalStack } from '~/components/ui/modal'

import { SharedModalAction } from './__internal/SharedModalAction'

function createExcalidrawDiv(contents: string) {
  return {
    type: 'excalidraw',
    value: contents,
  }
}

function visitCodeBlock(ast: Node) {
  return visit(
    ast,
    'code',
    (node, index, parent: Node & { children: Node[] }) => {
      const { lang, value } = node

      // If this codeblock is not excalidraw, bail.
      if (lang !== 'excalidraw') return node

      const newNode = createExcalidrawDiv(value)

      if (parent && index != null) parent.children.splice(index, 1, newNode)

      return node
    },
  )
}

function remarkExcalidraw() {
  function transformer(tree: Node) {
    visitCodeBlock(tree)
  }

  return transformer
}

const id = 'excalidraw'
/// Schema for diagram node.
export const excalidrawSchema = $nodeSchema(id, () => {
  return {
    content: 'text*',
    group: 'block',
    marks: '',
    defining: true,
    atom: true,
    isolating: true,
    attrs: {
      value: {
        default: '',
      },
    },

    parseMarkdown: {
      match: ({ type }) => type === id,
      runner: (state, node, type) => {
        const value = node.value as string
        state.addNode(type, { value })
      },
    },
    toMarkdown: {
      match: (node) => node.type.name === id,
      runner: (state, node) => {
        state.addNode('code', undefined, node.attrs.value || '', {
          lang: 'excalidraw',
        })
      },
    },
  }
})

/// A input rule that will insert a diagram node when you type ` ```excalidraw `.
const insertExcalidrawInputRules = $inputRule(
  (ctx) =>
    new InputRule(/^```excalidraw$/, (state, _match, start, end) => {
      const nodeType = excalidrawSchema.type(ctx)
      const $start = state.doc.resolve(start)
      if (
        !$start
          .node(-1)
          .canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)
      )
        return null
      return state.tr
        .delete(start, end)
        .setBlockType(start, start, nodeType, {})
    }),
)

/// A remark plugin that will parse mermaid code block.
const remarkExcalidrawPlugin = $remark(
  'remarkExcalidraw',
  () => remarkExcalidraw,
)

/// A command that will insert a excalidraw node.
const insertExcalidrawCommand = $command(
  'InsertExcalidrawCommand',
  (ctx) => () => setBlockType(excalidrawSchema.type(ctx)),
)

export const ExcalidrawPlugins: (pluginCtx: PluginCtx) => MilkdownPlugin[] = ({
  nodeViewFactory,
}) => [
  insertExcalidrawInputRules,
  insertExcalidrawCommand,
  excalidrawSchema as any as MilkdownPlugin,
  remarkExcalidrawPlugin as any as MilkdownPlugin,
  $view(excalidrawSchema.node, () =>
    nodeViewFactory({
      component: ExcalidrawBoard,
    }),
  ),
]

const ExcalidrawBoard: FC = () => {
  const modalStack = useModalStack()
  const nodeCtx = useNodeViewContext()
  const content = nodeCtx.node.attrs.value

  const [forceUpdate, key] = useForceUpdate()
  useEffect(() => {
    forceUpdate()
  }, [content])

  const Excalidraw = useMemo(
    () =>
      lazy(() =>
        import('~/components/ui/excalidraw/Excalidraw').then((m) => ({
          default: m.Excalidraw,
        })),
      ),
    [],
  )

  const handleEdit = () => {
    const Content: FC<ModalContentPropsInternal> = () => {
      const valueRef = useRef<string | undefined>(content)
      const valueGetterRef = useRef(() => valueRef.current)
      return (
        <div className="flex h-full w-full flex-col">
          <Suspense>
            <Excalidraw
              className="h-full w-full flex-grow"
              data={JSON.parse(content)}
              viewModeEnabled={false}
              zenModeEnabled={false}
              onChange={async (elements, appState, files) => {
                const serializeAsJSON = await import(
                  '@excalidraw/excalidraw'
                ).then((m) => m.serializeAsJSON)
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
              save={() => {
                nodeCtx.setAttrs({ value: valueRef.current })
              }}
            />
          </Suspense>
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
      <Suspense fallback={<BlockLoading />}>
        <Excalidraw
          className="pointer-events-none"
          showExtendButton={false}
          key={key}
          data={useMemo(() => JSON.parse(content || '{}'), [content])}
        />
      </Suspense>
    </div>
  )
}
