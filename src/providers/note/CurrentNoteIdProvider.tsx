'use client'

import { memo, useEffect } from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import type { FC, PropsWithChildren } from 'react'

import { useBeforeMounted } from '~/hooks/common/use-before-mounted'
import { jotaiStore } from '~/lib/store'

const currentNoteIdAtom = atom<null | string>(null)
const CurrentNoteIdProvider: FC<
  {
    noteId: string
  } & PropsWithChildren
> = memo(({ noteId, children }) => {
  const setNoteId = useSetAtom(currentNoteIdAtom)
  useBeforeMounted(() => {
    // setNoteId(noteId)
    jotaiStore.set(currentNoteIdAtom, noteId)
  })

  useEffect(() => {
    setNoteId(noteId)
  }, [noteId])

  return children
})
const useCurrentNoteId = () => {
  return useAtomValue(currentNoteIdAtom)
}

export { useCurrentNoteId, CurrentNoteIdProvider }
