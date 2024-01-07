import React, { useEffect, useRef } from 'react'
import { produce } from 'immer'
import { atom, useAtomValue, useSetAtom, useStore } from 'jotai'
import type { FC } from 'react'
import type { MilkdownRef } from '../editor'

import { redoCommand, undoCommand } from '@milkdown/plugin-history'
import { callCommand } from '@milkdown/utils'

import { useEventCallback } from '~/hooks/common/use-event-callback'
import { clsxm } from '~/lib/helper'
import { jotaiStore } from '~/lib/store'

import { MilkdownEditor } from '../editor'
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

      <MenuBar />
      <Editor />
    </>
  )
}

const MenuBar = () => {
  const editorRef = useEditorRef()

  const menuList = [
    {
      icon: 'icon-[material-symbols--undo]',
      action: callCommand(undoCommand.key),
    },
    {
      icon: 'icon-[material-symbols--redo]',
      action: callCommand(redoCommand.key),
    },
    {
      icon: 'icon-[material-symbols--redo]',
      action: callCommand(redoCommand.key),
    },
  ]

  return (
    <div className="my-2 flex w-full space-x-2">
      {menuList.map((menu, key) => (
        <button
          key={key}
          className="flex items-center justify-center rounded p-2 text-xl text-gray-500 hover:bg-gray-300 hover:text-black"
          onClick={() => editorRef?.getAction(menu.action)}
        >
          <i className={menu.icon} />
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
  const handleMarkdownChange = useEventCallback(setText)
  const milkdownRef = useRef<MilkdownRef>(null)

  useEffect(() => {
    jotaiStore.set(milkdownRefAtom, milkdownRef.current)
    return () => {
      jotaiStore.set(milkdownRefAtom, null)
    }
  }, [])

  return (
    <div
      className={clsxm(
        'relative h-0 flex-grow overflow-auto rounded-xl border p-3 duration-200 focus-within:border-primary',
        'border-zinc-200 bg-white placeholder:text-slate-500 focus-visible:border-primary dark:border-neutral-800 dark:bg-zinc-900',
      )}
    >
      <MilkdownEditor
        ref={milkdownRef}
        onMarkdownChange={handleMarkdownChange}
        initialMarkdown={store.get(ctxAtom).text}
      />
    </div>
  )
}

const milkdownRefAtom = atom<MilkdownRef | null>(null)
export const useEditorRef = () => useAtomValue(milkdownRefAtom)
