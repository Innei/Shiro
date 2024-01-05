import { createModelDataProvider } from 'jojoo/react'
import { useContext, useMemo } from 'react'
import { produce } from 'immer'
import { atom, useAtom } from 'jotai'
import type { PostModel } from '@mx-space/api-client'
import type { PostDto } from '~/models/writing'

export const {
  useModelDataSelector: usePostModelDataSelector,
  useSetModelData: usePostModelSetModelData,
  useGetModelData: usePostModelGetModelData,

  ModelDataAtomProvider: PostModelDataAtomProvider,

  ModelDataAtomContext,
} = createModelDataProvider<PostModel | PostDto>()

export const usePostModelSingleFieldAtom = (
  key: keyof PostModel & keyof PostDto,
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
  )
}
