'use client'

import { memo, useEffect } from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import type { FC, PropsWithChildren } from 'react'

import { jotaiStore } from '~/lib/store'

const currentNoteNidAtom = atom<null | string>(null)
export const CurrentNoteNidProvider: FC<
  {
    nid: string
  } & PropsWithChildren
> = memo(({ nid, children }) => {
  const setNoteId = useSetAtom(currentNoteNidAtom)
  useHydrateAtoms([[currentNoteNidAtom, nid]], {
    dangerouslyForceHydrate: true,
  })

  useEffect(() => {
    setNoteId(nid)
  }, [nid])

  return children
})
CurrentNoteNidProvider.displayName = 'CurrentNoteIdProvider'

export const useCurrentNoteNid = () => {
  return useAtomValue(currentNoteNidAtom)
}

/**
 * Only used in error page to set current note id
 */
export const setCurrentNoteNid = (noteId: string) => {
  jotaiStore.set(currentNoteNidAtom, noteId)
}
