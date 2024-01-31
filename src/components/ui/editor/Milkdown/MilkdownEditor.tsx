import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import {
  ProsemirrorAdapterProvider,
  useNodeViewContext,
  useNodeViewFactory,
} from '@prosemirror-adapter/react'
import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
} from 'react'
import directive from 'remark-directive'
import type { Config } from '@milkdown/core'
import type { MilkdownPlugin } from '@milkdown/ctx'

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
import { InputRule } from '@milkdown/prose/inputrules'
import { $inputRule, $node, $remark, $view, replaceAll } from '@milkdown/utils'

import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'

import styles from './index.module.css'
import { attacher } from './plugins/strike'

const Container = (props) => {
  const { contentRef, node, view, setAttrs } = useNodeViewContext()
  console.log('aaaaa', useNodeViewContext())
  return (
    <button
      ref={contentRef}
      onClick={() => {
        setAttrs({ src: `https://saul-mirone.github.io?${Math.random()}` })

        // const state = view.state
        // state.doc.descendants((node, pos) => {
        //   console.log(node, 'node')

        //   if (node.type.name === 'iframe') {
        //     const { tr } = state
        //     tr.replaceWith(
        //       pos,
        //       pos + node.nodeSize,
        //       node.type.create({
        //         src: `https://saul-mirone.github.io?${Math.random()}`,
        //       }),
        //     )
        //     view.dispatch(tr)
        //     return false
        //   }
        // })
      }}
    >
      {node.attrs.src}
    </button>
  )
}

const remarkDirective = $remark(
  'directive',
  () => directive,
) as any as MilkdownPlugin

const line = $remark('line', () => attacher()) as any as MilkdownPlugin

const directiveGird = $node('grid', (ctx) => ({
  group: 'block',
  atom: true,
  isolating: true,
  marks: '',
  attrs: {
    cols: { default: null },
    rows: { default: null },
  },

  parseMarkdown: {
    match: (node) => {
      console.log(node, 'node')
      return node.type === 'containerDirective' && node.name === 'grid'
    },
    runner: (state, node, type) => {
      state.addNode(type, { ...node.attributes })
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === 'grid',
    runner: (state, node) => {
      state.addNode('containerDirective', undefined, undefined, {
        name: 'grid',
        attributes: { ...node.attrs },
      })
    },
  },
}))

const directiveNode = $node('iframe', (ctx) => ({
  group: 'block',
  atom: true,
  isolating: true,
  marks: '',
  attrs: {
    src: { default: null },
  },
  // parseDOM: [
  //   {
  //     tag: 'iframe',
  //     getAttrs: (dom) => ({
  //       src: (dom as HTMLElement).getAttribute('src'),
  //     }),
  //   },
  // ],

  // toDOM: (node) => {
  //   const $button = document.createElement('button')
  //   $button.innerHTML = node.attrs.src
  //   $button.onclick = (e) => {
  //     const edtior = ctx.get(editorViewCtx)
  //     const state = edtior.state
  //     state.doc.descendants((node, pos) => {
  //       console.log(node, 'node')

  //       if (node.type.name === 'iframe') {
  //         const { tr } = state
  //         tr.replaceWith(
  //           pos,
  //           pos + node.nodeSize,
  //           node.type.create({
  //             src: `https://saul-mirone.github.io?${Math.random()}`,
  //           }),
  //         )
  //         edtior.dispatch(tr)
  //         return false
  //       }
  //     })
  //   }
  //   return $button as InstanceType<typeof window.Node>
  //   // return [
  //   //   $button,
  //   //   {
  //   //     ...node.attrs,

  //   //     contenteditable: false,
  //   //     onclick() {
  //   //       return console.log(node, 'node')
  //   //     },
  //   //   },
  //   //   'aa',
  //   // ] as const
  // },

  parseMarkdown: {
    match: (node) => {
      console.log(node, 'node')
      return node.type === 'leafDirective' && node.name === 'iframe'
    },
    runner: (state, node, type) => {
      state.addNode(type, { src: (node.attributes as { src: string }).src })
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === 'iframe',
    runner: (state, node) => {
      state.addNode('leafDirective', undefined, undefined, {
        name: 'iframe',
        attributes: { src: node.attrs.src },
      })
    },
  },
}))
const inputRule = $inputRule(
  (ctx) =>
    new InputRule(
      /::iframe\{src="(?<src>[^"]+)?"?\}/,
      (state, match, start, end) => {
        const [okay, src = ''] = match
        const { tr } = state
        if (okay) {
          tr.replaceWith(
            start - 1,
            end,
            directiveNode.type(ctx).create({ src }),
          )
        }

        return tr
      },
    ),
)

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

    nodeViewFactory({
      component: Container,
    })

    const { get } = useEditor((root) => {
      const editor = Editor.make()
      editorRef.current = editor

      return editor
        .config((ctx) => {
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
        .use([remarkDirective, line, directiveNode, directiveGird, inputRule])
        .use(
          $view(directiveNode, () =>
            nodeViewFactory({
              component: Container,
            }),
          ),
        )
        .use(
          $view(directiveGird, () =>
            nodeViewFactory({
              component: Container,
            }),
          ),
        )
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
