'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { type NoteWrappedPayload } from '@mx-space/api-client'

import { queries } from '~/queries/definition'

import { createDataProvider } from '../internal/createDataProvider'

const {
  CurrentDataProvider,
  CurrentDataAtomProvider,
  getGlobalCurrentData: getCurrentData,
  setGlobalCurrentData: setCurrentData,
  useCurrentDataSelector,
  useSetCurrentData,
} = createDataProvider<NoteWrappedPayload>()

export {
  CurrentDataProvider as CurrentNoteDataProvider,
  CurrentDataAtomProvider as CurrentNoteDataAtomProvider,
  getCurrentData as getCurrentNoteData,
  setCurrentData as setCurrentNoteData,
  useCurrentDataSelector as useCurrentNoteDataSelector,
  useSetCurrentData as useSetCurrentNoteData,
}

export const SyncNoteDataAfterLoggedIn = () => {
  const nid = useCurrentDataSelector((data) => data?.data.nid)
  const password = useSearchParams().get('password')
  const { data } = useQuery({
    ...queries.note.byNid(nid?.toString() || '', password),
    enabled: !!nid,
  })

  useEffect(() => {
    if (data) {
      setCurrentData((draft) => {
        draft.data = data.data
      })
    }
  }, [data])

  return null
}
