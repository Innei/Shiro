/* eslint-disable no-console */
import type { Config } from '@milkdown/core'
import {
  defaultValueCtx,
  Editor,
  EditorStatus,
  editorViewCtx,
  editorViewOptionsCtx,
  remarkStringifyOptionsCtx,
  rootCtx,
  serializerCtx,
} from '@milkdown/core'
import type { Ctx } from '@milkdown/ctx'
import { clipboard } from '@milkdown/plugin-clipboard'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import { replaceAll } from '@milkdown/utils'
import {
  ProsemirrorAdapterProvider,
  useNodeViewFactory,
} from '@prosemirror-adapter/react'
import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
} from 'react'

import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'
import { isDev } from '~/lib/env'

import { setEditorCtx } from './ctx'
import { extensionOfRemarkStringify } from './extensions/remark-stringify'
import styles from './index.module.css'
import { createPlugins } from './plugins'

export interface MilkdownProps {
  initialMarkdown?: string
  readonly?: boolean
  onBlur?(): void
  onChange?(e: { target: { value: string } }): void
  onMarkdownChange?(markdown: string): void
  onCreated?(): void
}

export interface MilkdownRef {
  getMarkdown(): string | undefined
  setMarkdown(markdown: string): void
  getAction(cb: (ctx: Ctx) => void): void

  editor: Editor
}

export const MilkdownEditor = forwardRef<MilkdownRef, MilkdownProps>(
  (props, ref) => {
    return (
      <MilkdownProvider>
        <ProsemirrorAdapterProvider>
          <MilkdownEditorImpl ref={ref} {...props} />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    )
  },
)

MilkdownEditor.displayName = 'MilkdownEditor'

const MilkdownEditorImpl = forwardRef<MilkdownRef, MilkdownProps>(
  (props, ref) => {
    const { initialMarkdown } = props

    const editorCtxRef = useRef<Parameters<Config>[0]>()
    const editorRef = useRef<Editor>()
    const getMarkdown = useCallback(
      () =>
        editorRef.current?.action((ctx) => {
          const editorView = ctx.get(editorViewCtx)
          const serializer = ctx.get(serializerCtx)
          return serializer(editorView.state.doc)
        }),
      [],
    )

    const nodeViewFactory = useNodeViewFactory()

    const { get } = useEditor((root) => {
      const editor = Editor.make()
      editorRef.current = editor

      return editor
        .config((ctx) => {
          setEditorCtx(ctx)
          editorCtxRef.current = ctx

          ctx.set(rootCtx, root)
          ctx.set(defaultValueCtx, initialMarkdown || '')
          editorCtxRef.current.update(editorViewOptionsCtx, (ctx) => ({
            ...ctx,
            editable: () => !props.readonly,
          }))

          const originalStringifyOptions = ctx.get(remarkStringifyOptionsCtx)

          ctx.set(remarkStringifyOptionsCtx, {
            handlers: {
              ...originalStringifyOptions.handlers,
              ...(extensionOfRemarkStringify as any),
            },
          })

          ctx
            .get(listenerCtx)
            .markdownUpdated((ctx, markdown) => {
              if (isUnMounted.current) return

              if (isDev) console.log('markdownUpdated', markdown)
              props.onMarkdownChange?.(markdown)
              props.onChange?.({ target: { value: markdown } })
            })
            .blur(() => {
              props.onBlur?.()
            })
        })
        .use(commonmark)
        .use(listener)
        .use(clipboard)
        .use(history)
        .use(indent)
        .use(gfm)
        .use(createPlugins({ nodeViewFactory }))

        .onStatusChange((o) => {
          if (o === EditorStatus.Created) {
            props.onCreated?.()
          }
        })
    }, [])

    const setMarkdown = useCallback(
      (markdown: string) => {
        get()?.action(replaceAll(markdown))
      },
      [get],
    )

    const getAction = useCallback(
      (cb: (ctx: Ctx) => void) => {
        get()?.action(cb)
      },
      [get],
    )

    useImperativeHandle(ref, () => ({
      getMarkdown,
      setMarkdown,
      getAction,
      get editor() {
        return editorRef.current!
      },
    }))

    const isUnMounted = useIsUnMounted()

    const id = useId()
    return (
      <div id={`milkdown-${id}`} className={styles.editor}>
        <Milkdown />
      </div>
    )
  },
)

MilkdownEditorImpl.displayName = 'MilkdownEditorImpl'
