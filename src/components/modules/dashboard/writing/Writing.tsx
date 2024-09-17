import { editorViewCtx, schemaCtx } from '@milkdown/core'
import { redoCommand, undoCommand } from '@milkdown/plugin-history'
import {
  toggleEmphasisCommand,
  toggleStrongCommand,
  wrapInBulletListCommand,
  wrapInHeadingCommand,
  wrapInOrderedListCommand,
} from '@milkdown/preset-commonmark'
import { callCommand } from '@milkdown/utils'
import { produce } from 'immer'
import { atom, useAtomValue, useSetAtom, useStore } from 'jotai'
import type { FC } from 'react'
import React, { isValidElement } from 'react'

import { SimpleIconsMermaid } from '~/components/icons/mermaid'
import { useEditorCtx } from '~/components/ui/editor/Milkdown/ctx'
import { excalidrawSchema } from '~/components/ui/editor/Milkdown/plugins/Excalidraw'
import { TextArea } from '~/components/ui/input'
import { useEventCallback } from '~/hooks/common/use-event-callback'

import type { MilkdownRef } from '../../../ui/editor'
import { useBaseWritingContext } from './BaseWritingProvider'
import { TitleInput } from './TitleInput'

export const Writing: FC<{
  middleSlot?: React.ReactNode | React.FunctionComponent<any>

  titleLabel?: string
}> = ({ middleSlot, titleLabel }) => {
  const middleSlotElement =
    typeof middleSlot === 'function'
      ? React.createElement(middleSlot)
      : middleSlot
  return (
    <>
      <TitleInput label={titleLabel} />

      {middleSlotElement && (
        <div className="my-3 flex items-center pl-2 text-sm text-gray-500">
          {middleSlotElement}
        </div>
      )}

      <Editor />
    </>
  )
}

const MenuBar = () => {
  const editorRef = useEditorRef()

  const ctx = useEditorCtx()

  const menuList = [
    {
      icon: 'icon-[material-symbols--undo]',
      action: () => editorRef?.getAction(callCommand(undoCommand.key)),
    },
    {
      icon: 'icon-[material-symbols--redo]',
      action: () => editorRef?.getAction(callCommand(redoCommand.key)),
    },
    {
      icon: 'icon-[mingcute--bold-fill]',
      action: () => editorRef?.getAction(callCommand(toggleStrongCommand.key)),
    },
    {
      icon: 'icon-[mingcute--italic-fill]',
      action: () =>
        editorRef?.getAction(callCommand(toggleEmphasisCommand.key)),
    },
    {
      icon: 'icon-[mingcute--list-check-fill]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInBulletListCommand.key)),
    },
    {
      icon: 'icon-[material-symbols--format-list-numbered-rounded]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInOrderedListCommand.key)),
    },
    {
      icon: 'icon-[material-symbols--format-h1]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInHeadingCommand.key, 1)),
    },
    {
      icon: 'icon-[material-symbols--format-h2]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInHeadingCommand.key, 2)),
    },
    {
      icon: 'icon-[material-symbols--format-h3]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInHeadingCommand.key, 3)),
    },
    {
      icon: 'icon-[material-symbols--format-h4]',
      action: () =>
        editorRef?.getAction(callCommand(wrapInHeadingCommand.key, 4)),
    },
    {
      icon: 'icon-[mingcute--drawing-board-line]',
      action: () => {
        if (!ctx) return
        const view = ctx.get(editorViewCtx)
        if (!view) return
        const { state } = view

        const currentCursorPosition = state.selection.from

        const schema = ctx.get(schemaCtx)
        const nextNode = schema.node(excalidrawSchema.type(ctx), {})
        const { tr } = state
        tr.replaceSelectionWith(nextNode)
        // 判断是否插入的 node 位于文档的末尾
        const isNewNodeIsEof =
          currentCursorPosition === state.doc.content.size ||
          currentCursorPosition + 1 === state.doc.content.size
        if (isNewNodeIsEof) tr.insert(tr.doc.content.size, schema.text('\n'))

        view.dispatch(tr)
      },
    },
    {
      icon: <SimpleIconsMermaid />,
      action: () => {
        if (!ctx) return
        const view = ctx.get(editorViewCtx)
        if (!view) return
        const { state } = view

        const currentCursorPosition = state.selection.from
        const schema = ctx.get(schemaCtx)
        const nextNode = schema.node('diagram', {
          value: '<auto_open>',
        })

        const { tr } = state
        tr.replaceSelectionWith(nextNode)
        // 判断是否插入的 node 位于文档的末尾
        const isNewNodeIsEof =
          currentCursorPosition === state.doc.content.size ||
          currentCursorPosition + 1 === state.doc.content.size
        if (isNewNodeIsEof) tr.insert(tr.doc.content.size, schema.text('\n'))

        view.dispatch(tr)
      },
    },
  ]

  return (
    <div className="my-2 flex w-full flex-wrap space-x-2">
      {menuList.map((menu, key) => (
        <button
          key={key}
          className="flex items-center justify-center rounded p-2 text-xl text-gray-500 hover:bg-gray-300 hover:text-black dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          onClick={() => {
            menu.action()

            editorRef?.getAction((ctx) => {
              ctx.get(editorViewCtx).focus()
            })
          }}
        >
          {isValidElement(menu.icon) ? (
            menu.icon
          ) : typeof menu.icon === 'string' ? (
            <i className={menu.icon} />
          ) : null}
        </button>
      ))}
    </div>
  )
}

const Editor = () => {
  const ctxAtom = useBaseWritingContext()
  const setAtom = useSetAtom(ctxAtom)
  const setText = useEventCallback((text: string) => {
    setAtom((prev) => {
      return produce(prev, (draft) => {
        draft.text = text
      })
    })
  })
  const store = useStore()

  return (
    <>
      {/* <MenuBar /> */}

      {/* <MilkdownEditor
          ref={milkdownRef}
          onMarkdownChange={handleMarkdownChange}
          initialMarkdown={store.get(ctxAtom).text}
        /> */}
      <TextArea
        className="bg-base-100"
        defaultValue={store.get(ctxAtom).text}
        onChange={(e) => {
          setText(e.target.value)
        }}
      />
    </>
  )
}

const milkdownRefAtom = atom<MilkdownRef | null>(null)
export const useEditorRef = () => useAtomValue(milkdownRefAtom)
