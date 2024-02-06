import { queryClient } from '~/providers/root/react-query-provider'
import { useCallback } from 'react'
import { atom, useAtomValue } from 'jotai'

import { getToken } from '~/lib/cookie'
import { apiClient } from '~/lib/request'
import { jotaiStore } from '~/lib/store'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export interface UrlConfig {
  adminUrl: string

  webUrl: string
}

const adminUrlAtom = atom<string | null>(null)
const webUrlAtom = atom<string | null>(null)

export const fetchAppUrl = async () => {
  const { data } = await queryClient.fetchQuery({
    queryKey: ['app.url'],
    queryFn: () =>
      apiClient.proxy.options.url.get<{
        data: UrlConfig
      }>(),
  })

  if (data.adminUrl) jotaiStore.set(adminUrlAtom, data.adminUrl)
  jotaiStore.set(webUrlAtom, data.webUrl)
  return data
}

export const getWebUrl = () => jotaiStore.get(webUrlAtom)
export const setWebUrl = (url: string) => jotaiStore.set(webUrlAtom, url)
export const getAdminUrl = () => jotaiStore.get(adminUrlAtom)
export const useAppUrl = () => {
  const url = useAggregationSelector((a) => a.url)
  const adminUrl = useAtomValue(adminUrlAtom)
  return {
    adminUrl,
    ...url,
  }
}

export const useResolveAdminUrl = () => {
  const { adminUrl } = useAppUrl()
  return useCallback(
    (path?: string) => {
      if (!adminUrl) {
        return ''
      }
      const parsedUrl = new URL(adminUrl.replace(/\/$/, ''))
      const token = getToken()
      if (token) {
        parsedUrl.searchParams.set('token', token)
      }

      return `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}${
        path || ''
      }${parsedUrl.search}`
    },
    [adminUrl],
  )
}
