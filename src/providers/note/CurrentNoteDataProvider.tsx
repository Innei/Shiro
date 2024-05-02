'use client'

import { useQuery } from '@tanstack/react-query'
import { createModelDataProvider } from 'jojoo/react'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import type { NoteWrappedPayload } from '@mx-space/api-client'

import { queries } from '~/queries/definition'

const {
  ModelDataProvider,
  ModelDataAtomProvider,
  getGlobalModelData: getModelData,
  setGlobalModelData: setModelData,
  useModelDataSelector,
  useSetModelData,
} = createModelDataProvider<NoteWrappedPayload>()

export {
  ModelDataProvider as CurrentNoteDataProvider,
  ModelDataAtomProvider as CurrentNoteDataAtomProvider,
  getModelData as getCurrentNoteData,
  setModelData as setCurrentNoteData,
  useModelDataSelector as useCurrentNoteDataSelector,
  useSetModelData as useSetCurrentNoteData,
}

export const SyncNoteDataAfterLoggedIn = () => {
  const nid = useModelDataSelector((data) => data?.data.nid)
  const password = useSearchParams().get('password')
  const { data } = useQuery({
    ...queries.note.byNid(nid?.toString() || '', password),
    enabled: !!nid,
  })

  useEffect(() => {
    if (data) {
      setModelData((draft) => {
        draft.data = data.data
      })
    }
  }, [data])

  return null
}
