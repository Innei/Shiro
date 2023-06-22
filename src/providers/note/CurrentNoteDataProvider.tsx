'use client'

import { type NoteWrappedPayload } from '@mx-space/api-client'

import { createDataProvider } from '../internal/createDataProvider'

const {
  CurrentDataProvider,
  getCurrentData,
  setCurrentData,
  useCurrentDataSelector,
} = createDataProvider<NoteWrappedPayload>()

export {
  CurrentDataProvider as CurrentNoteDataProvider,
  getCurrentData as getCurrentNoteData,
  setCurrentData as setCurrentNoteData,
  useCurrentDataSelector as useCurrentNoteDataSelector,
}
