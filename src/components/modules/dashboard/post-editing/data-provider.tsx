import { createModelDataProvider } from 'jojoo/react'
import { useContext, useMemo } from 'react'
import { produce } from 'immer'
import { atom, useAtom } from 'jotai'
import type { PostDto } from '~/models/writing'

export const {
  useModelDataSelector: usePostModelDataSelector,
  useSetModelData: usePostModelSetModelData,
  useGetModelData: usePostModelGetModelData,

  ModelDataAtomProvider: PostModelDataAtomProvider,

  ModelDataAtomContext,
} = createModelDataProvider<PostDto>()

export const usePostModelSingleFieldAtom = <
  T extends keyof PostDto = keyof PostDto,
>(
  key: T,
) => {
  const ctxAtom = useContext(ModelDataAtomContext)
  return useAtom(
    useMemo(() => {
      return atom(
        (get) => {
          const data = get(ctxAtom)
          return data?.[key]
        },
        (get, set, update: any) => {
          set(ctxAtom, (prev) => {
            return produce(prev, (draft) => {
              ;(draft as any)[key as any] = update
            })
          })
        },
      )
    }, [ctxAtom, key]),
  ) as any as [
    NonNullable<PostDto[T]>,

    (update: PostDto[T]) => PostDto[T] | void,
  ]
}
