'use client'

import { memo, useCallback, useEffect } from 'react'
import { produce } from 'immer'
import { atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { NoteWrappedPayload } from '@mx-space/api-client'
import type { FC, PropsWithChildren } from 'react'

import { useBeforeMounted } from '~/hooks/common/use-before-mounted'
import { noopArr } from '~/lib/noop'
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
export const useCurrentNoteDataSelector = <T,>(
  selector: (data: NoteWrappedPayload | null) => T,
  deps?: any[],
) => {
  const nextSelector = useCallback((data: NoteWrappedPayload | null) => {
    return data ? selector(data) : null
  }, deps || noopArr)

  return useAtomValue(selectAtom(currentNoteDataAtom, nextSelector))
}

export const setCurrentNoteData = (
  recipe: (draft: NoteWrappedPayload) => void,
) => {
  jotaiStore.set(
    currentNoteDataAtom,
    produce(jotaiStore.get(currentNoteDataAtom), recipe),
  )
}

export const getCurrentNoteData = () => {
  return jotaiStore.get(currentNoteDataAtom)
}
