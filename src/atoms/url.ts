import { atom, useAtomValue } from 'jotai'

import { jotaiStore } from '~/lib/store'
import { apiClient } from '~/utils/request'

export interface UrlConfig {
  adminUrl: string
  backendUrl: string

  frontendUrl: string
}

const appUrlAtom = atom<UrlConfig | null>(null)

export const fetchAppUrl = async () => {
  const { data } = await apiClient.proxy.options.url.get<{
    data: UrlConfig
  }>()

  jotaiStore.set(appUrlAtom, data)
}

export const getAppUrl = () => jotaiStore.get(appUrlAtom)
export const useAppUrl = () => useAtomValue(appUrlAtom)
