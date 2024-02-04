import { useNodeViewContext } from '@prosemirror-adapter/react'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useForceUpdate } from 'framer-motion'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { diff } from 'jsondiffpatch'
import { visit } from 'unist-util-visit'
import type { MilkdownPlugin } from '@milkdown/ctx'
import type { Node } from '@milkdown/transformer'
import type { ExcalidrawRefObject } from '~/components/ui/excalidraw'
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
import { StyledButton } from '~/components/ui/button'
import { CheckBoxLabel } from '~/components/ui/checkbox'
import { useModalStack } from '~/components/ui/modal'
import { safeJsonParse } from '~/lib/helper'
import { buildNSKey } from '~/lib/ns'
import { toast } from '~/lib/toast'
import { FileTypeEnum, uploadFileToServer } from '~/lib/upload'

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

    parseDOM: [
      {
        tag: `div[data-type="${id}"]`,
        preserveWhitespace: 'full',
        getAttrs: (dom) => {
          return {
            value: (dom as any)?.dataset?.value || '',
          }
        },
      },
    ],
    toDOM: (node) => {
      const code = node.attrs.value as string

      const dom = document.createElement('div')
      dom.dataset.type = id

      dom.dataset.value = code
      dom.textContent = code

      return dom
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

const excalidrawOptionAtom = atomWithStorage(buildNSKey('excalidraw'), {
  embed: false,
  delta: true,
})

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

  const [initialContent, resetInitialContent] = useState(content)

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

      const [editorOption, setEditorOption] = useAtom(excalidrawOptionAtom)
      const excalidrawRef = useRef<ExcalidrawRefObject>(null)

      const alreadyUploadValueFileMap = useRef(
        {} as Record<string, string>,
      ).current

      const getFinalSaveValue = async (): Promise<string | undefined> => {
        if (editorOption.delta) {
          const currentData = valueRef.current
          if (!currentData) {
            toast.error('无法获取当前数据，更新失败')
            return
          }

          // 如果是增量存储

          if (!initialContent) {
            // 没有初始数据的话，直接刷新文件 Link
            return fullFileUpdateAsLink()
          }

          // 初始数据是嵌入式数据
          const isEmbeddedData = safeJsonParse(initialContent)
          if (isEmbeddedData) {
            // 如果是嵌入式数据，直接更新为 link
            return fullFileUpdateAsLink()
          }

          // 初始数据是文件链接
          const dataRefData = excalidrawRef.current?.getRefData()

          if (!dataRefData) {
            toast.error('无法获取原始数据增量更新失败')
            return
          }

          const delta = diff(dataRefData, JSON.parse(currentData))
          const firstLine = initialContent.split('\n')[0]
          return [firstLine, JSON.stringify(delta, null, 0)].join('\n')
        } else if (editorOption.embed) {
          return valueRef.current
        }

        if (!editorOption.delta && !editorOption.embed) {
          return fullFileUpdateAsLink()
        }

        async function fullFileUpdateAsLink() {
          // 更新为链接类型
          const currentData = valueRef.current
          if (!currentData) return

          const hasUploaded = alreadyUploadValueFileMap[currentData]
          if (hasUploaded) {
            return hasUploaded
          }

          const file = new File([currentData], 'file.excalidraw', {})
          const infoToast = toast.info('正在上传文件', {
            position: 'top-right',
          })
          const result = await uploadFileToServer(FileTypeEnum.File, file)

          toast.success('上传成功', { position: 'top-right' })
          toast.dismiss(infoToast)
          const refName = `ref:file/${result.name}`
          alreadyUploadValueFileMap[currentData] = refName
          return refName
        }
      }
      return (
        <div className="flex h-full w-full flex-col">
          <Suspense>
            <Excalidraw
              ref={excalidrawRef}
              className="h-full w-full flex-grow"
              data={content}
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

            <div className="relative">
              <div className="absolute bottom-1 left-1 space-x-2">
                <CheckBoxLabel
                  label="使用内嵌数据"
                  onCheckChange={(checked) => {
                    setEditorOption((prev) => ({ ...prev, embed: checked }))
                  }}
                  checked={editorOption.embed}
                />
                <CheckBoxLabel
                  label="使用增量存储"
                  checked={editorOption.embed ? false : editorOption.delta}
                  disabled={editorOption.embed}
                  onCheckChange={(checked) => {
                    setEditorOption((prev) => ({ ...prev, delta: checked }))
                  }}
                />
              </div>

              <SharedModalAction
                getValue={valueGetterRef.current}
                nodeCtx={nodeCtx}
                save={async () => {
                  const value = await getFinalSaveValue()
                  if (!value) return
                  nodeCtx.setAttrs({ value })
                  resetInitialContent(value)
                }}
              >
                <StyledButton
                  variant="secondary"
                  onClick={async () => {
                    const value = await getFinalSaveValue()
                    if (!value) {
                      toast.error('无法获取当前数据')
                      return
                    }
                    await navigator.clipboard.writeText(
                      `\`\`\`excalidraw\n${value}\n\`\`\``,
                    )
                    toast.success('已复制', { position: 'top-right' })
                  }}
                >
                  复制
                </StyledButton>
              </SharedModalAction>
            </div>
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
          data={content}
        />
      </Suspense>
    </div>
  )
}
