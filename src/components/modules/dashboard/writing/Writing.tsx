import React, { useEffect, useRef } from 'react'
import { produce } from 'immer'
import { atom, useAtomValue, useSetAtom, useStore } from 'jotai'
import type { FC } from 'react'
import type { MilkdownRef } from '../../../ui/editor'

import { useEventCallback } from '~/hooks/common/use-event-callback'
import { clsxm } from '~/lib/helper'
import { jotaiStore } from '~/lib/store'

import { MilkdownEditor } from '../../../ui/editor'
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
        'relative h-0 flex-grow overflow-auto rounded-xl border p-3 duration-200 focus-within:border-accent',
        'border-zinc-200 bg-white placeholder:text-slate-500 focus-visible:border-accent dark:border-neutral-800 dark:bg-zinc-900',
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
