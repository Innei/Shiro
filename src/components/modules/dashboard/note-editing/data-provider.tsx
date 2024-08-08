import { produce } from 'immer'
import { createModelDataProvider } from 'jojoo/react'
import { atom, useAtom } from 'jotai'
import { useContext, useMemo } from 'react'

import type { NoteDto } from '~/models/writing'

export const {
  useModelDataSelector: useNoteModelDataSelector,
  useSetModelData: useNoteModelSetModelData,
  useGetModelData: useNoteModelGetModelData,

  ModelDataAtomProvider: NoteModelDataAtomProvider,

  ModelDataAtomContext,
} = createModelDataProvider<NoteDto>()

export const useNoteModelSingleFieldAtom = <
  T extends keyof NoteDto = keyof NoteDto,
>(
  key: T,
) => {
  const ctxAtom = useContext(ModelDataAtomContext)
  if (!ctxAtom)
    throw new Error(
      'useNoteModelSingleFieldAtom must be used inside NoteModelDataAtomProvider',
    )
  return useAtom(
    useMemo(
      () =>
        atom(
          (get) => {
            const data = get(ctxAtom)

            return data?.[key]
          },
          (get, set, update: any) => {
            set(ctxAtom, (prev) =>
              produce(prev, (draft) => {
                ;(draft as any)[key as any] = update
              }),
            )
          },
        ),
      [ctxAtom, key],
    ),
  ) as any as [
    NonNullable<NoteDto[T]>,

    (update: NoteDto[T]) => NoteDto[T] | void,
  ]
}
