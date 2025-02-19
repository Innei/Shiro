import { produce } from 'immer'
import { atom, useAtomValue, useSetAtom, useStore } from 'jotai'
import type { FC } from 'react'
import * as React from 'react'

import { TextArea } from '~/components/ui/input'
import { useEventCallback } from '~/hooks/common/use-event-callback'

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

const editorRefAtom = atom<HTMLTextAreaElement | null>(null)

const Editor = () => {
  const ctxAtom = useBaseWritingContext()
  const setAtom = useSetAtom(ctxAtom)
  const setText = useEventCallback((text: string) => {
    setAtom((prev) =>
      produce(prev, (draft) => {
        draft.text = text
      }),
    )
  })
  const store = useStore()

  const setEditorRef = useSetAtom(editorRefAtom)
  return (
    <TextArea
      ref={setEditorRef}
      className="bg-base-100"
      defaultValue={store.get(ctxAtom).text}
      onChange={(e) => {
        setText(e.target.value)
      }}
    />
  )
}

export const useEditorRef = () => useAtomValue(editorRefAtom)
