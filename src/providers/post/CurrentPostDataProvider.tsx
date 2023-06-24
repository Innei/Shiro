'use client'

import type { PostModel } from '@mx-space/api-client'

import { isClientSide, isDev } from '~/utils/env'

import { createDataProvider } from '../internal/createDataProvider'

const {
  CurrentDataProvider,
  getCurrentData,
  setCurrentData,
  useCurrentDataSelector,
} = createDataProvider<PostModel>()

declare global {
  interface Window {
    getCurrentPostData: typeof getCurrentData
  }
}
if (isDev && isClientSide) window.getCurrentPostData = getCurrentData

export {
  CurrentDataProvider as CurrentPostDataProvider,
  getCurrentData as getCurrentPostData,
  setCurrentData as setCurrentPostData,
  useCurrentDataSelector as useCurrentPostDataSelector,
}
