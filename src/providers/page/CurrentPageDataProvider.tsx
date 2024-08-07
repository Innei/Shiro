'use client'

import type { PageModel } from '@mx-space/api-client'
import { createModelDataProvider } from 'jojoo/react'

import { isClientSide, isDev } from '~/lib/env'

const {
  ModelDataProvider,
  getGlobalModelData: getModelData,
  setGlobalModelData: setModelData,
  useModelDataSelector,
  ModelDataAtomProvider,
} = createModelDataProvider<PageModel>()

declare global {
  interface Window {
    getCurrentPageData: typeof getModelData
  }
}

if (isDev && isClientSide) window.getCurrentPageData = getModelData

export {
  ModelDataAtomProvider as CurrentPageDataAtomProvider,
  ModelDataProvider as CurrentPageDataProvider,
  getModelData as getCurrentPageData,
  setModelData as setCurrentPageData,
  useModelDataSelector as useCurrentPageDataSelector,
}
