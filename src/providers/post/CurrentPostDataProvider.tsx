'use client'

import { createModelDataProvider } from 'jojoo/react'
import type { PostModel } from '@mx-space/api-client'

import { isClientSide, isDev } from '~/lib/env'

const {
  ModelDataProvider,
  ModelDataAtomProvider,
  getGlobalModelData,
  setGlobalModelData,
  useModelDataSelector,
} = createModelDataProvider<PostModel>()

declare global {
  interface Window {
    getModelPostData: typeof getGlobalModelData
  }
}
if (isDev && isClientSide) window.getModelPostData = getGlobalModelData

export {
  ModelDataProvider as CurrentPostDataProvider,
  ModelDataAtomProvider as CurrentPostDataAtomProvider,
  getGlobalModelData as getGlobalCurrentPostData,
  setGlobalModelData as setGlobalCurrentPostData,
  useModelDataSelector as useCurrentPostDataSelector,
}
