'use client'

import type { NoteWrappedWithLikedAndTranslationPayload } from '@mx-space/api-client'
import { useQuery } from '@tanstack/react-query'
import { createModelDataProvider } from 'jojoo/react'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useEffect } from 'react'

import { queries } from '~/queries/definition'

const {
  ModelDataProvider,
  ModelDataAtomProvider,
  getGlobalModelData: getModelData,
  setGlobalModelData: setModelData,
  useModelDataSelector,
  useSetModelData,
} = createModelDataProvider<NoteWrappedWithLikedAndTranslationPayload>()

export {
  ModelDataAtomProvider as CurrentNoteDataAtomProvider,
  ModelDataProvider as CurrentNoteDataProvider,
  getModelData as getCurrentNoteData,
  setModelData as setCurrentNoteData,
  useModelDataSelector as useCurrentNoteDataSelector,
  useSetModelData as useSetCurrentNoteData,
}

export const SyncNoteDataAfterLoggedIn = () => {
  const nid = useModelDataSelector((data) => data?.data.nid)
  const password = useSearchParams().get('password')
  const locale = useLocale()
  const { data } = useQuery({
    ...queries.note.byNid(nid?.toString() || '', password, locale),
    enabled: !!nid,
  })

  useEffect(() => {
    if (data) {
      const noteData = data as NoteWrappedWithLikedAndTranslationPayload
      setModelData((draft) => {
        draft.data = noteData.data
      })
    }
  }, [data])

  return null
}
