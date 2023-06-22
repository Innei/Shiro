'use client'

import type { PostModel } from '@mx-space/api-client'

import { createDataProvider } from '../internal/createDataProvider'

const {
  CurrentDataProvider,
  getCurrentData,
  setCurrentData,
  useCurrentDataSelector,
} = createDataProvider<PostModel>()

export {
  CurrentDataProvider as CurrentPostDataProvider,
  getCurrentData as getCurrentPostData,
  setCurrentData as setCurrentPostData,
  useCurrentDataSelector as useCurrentPostDataSelector,
}
