'use client'

import type { PostModel } from '@mx-space/api-client'

import { isClientSide, isDev } from '~/lib/env'

import { createDataProvider } from '../internal/createDataProvider'

const {
  CurrentDataProvider,
  CurrentDataAtomProvider,
  getGlobalCurrentData,
  setGlobalCurrentData,
  useCurrentDataSelector,
} = createDataProvider<PostModel>()

declare global {
  interface Window {
    getCurrentPostData: typeof getGlobalCurrentData
  }
}
if (isDev && isClientSide) window.getCurrentPostData = getGlobalCurrentData

export {
  CurrentDataProvider as CurrentPostDataProvider,
  CurrentDataAtomProvider as CurrentPostDataAtomProvider,
  getGlobalCurrentData as getGlobalCurrentPostData,
  setGlobalCurrentData as setGlobalCurrentPostData,
  useCurrentDataSelector as useCurrentPostDataSelector,
}
