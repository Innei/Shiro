'use client'

import type { PageModel } from '@mx-space/api-client'

import { isClientSide, isDev } from '~/lib/env'

import { createDataProvider } from '../internal/createDataProvider'

const {
  CurrentDataProvider,
  getGlobalCurrentData: getCurrentData,
  setGlobalCurrentData: setCurrentData,
  useCurrentDataSelector,
} = createDataProvider<PageModel>()

declare global {
  interface Window {
    getCurrentPageData: typeof getCurrentData
  }
}
if (isDev && isClientSide) window.getCurrentPageData = getCurrentData

export {
  CurrentDataProvider as CurrentPageDataProvider,
  getCurrentData as getCurrentPageData,
  setCurrentData as setCurrentPageData,
  useCurrentDataSelector as useCurrentPageDataSelector,
}
