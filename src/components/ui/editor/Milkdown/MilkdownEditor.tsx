import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
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
import type { Config } from '@milkdown/core'

import {
  defaultValueCtx,
  Editor,
  EditorStatus,
  editorViewCtx,
  editorViewOptionsCtx,
  rootCtx,
  serializerCtx,
} from '@milkdown/core'
import { clipboard } from '@milkdown/plugin-clipboard'
import { history } from '@milkdown/plugin-history'
import { indent } from '@milkdown/plugin-indent'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { replaceAll } from '@milkdown/utils'

import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'

import { setEditorCtx } from './ctx'
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

          ctx
            .get(listenerCtx)
            .markdownUpdated((ctx, markdown) => {
              if (isUnMounted.current) return

              console.log('markdown', markdown)
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

    useImperativeHandle(ref, () => ({
      getMarkdown,
      setMarkdown,
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
