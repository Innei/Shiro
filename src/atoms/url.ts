import { queryClient } from '~/providers/root/react-query-provider'
import { atom } from 'jotai'

import { apiClient } from '~/lib/request.new'
import { jotaiStore } from '~/lib/store'

export interface UrlConfig {
  adminUrl: string

  webUrl: string
}

export const adminUrlAtom = atom<string | null>(null)
export const webUrlAtom = atom<string | null>(null)

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
