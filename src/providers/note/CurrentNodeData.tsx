'use client'

import { memo, useEffect } from 'react'
import { atom, useAtomValue } from 'jotai'
import type { NoteWrappedPayload } from '@mx-space/api-client'
import type { FC, PropsWithChildren } from 'react'

import { useBeforeMounted } from '~/hooks/common/use-before-mounted'
import { jotaiStore } from '~/lib/store'

const currentNoteDataAtom = atom<null | NoteWrappedPayload>(null)
export const CurrentNoteDataProvider: FC<
  {
    data: NoteWrappedPayload
  } & PropsWithChildren
> = memo(({ data, children }) => {
  useBeforeMounted(() => {
    jotaiStore.set(currentNoteDataAtom, data)
  })

  useEffect(() => {
    jotaiStore.set(currentNoteDataAtom, data)
  }, [data])

  return children
})
export const useCurrentNoteData = () => {
  return useAtomValue(currentNoteDataAtom)
}
