import { useCallback } from 'react'
import { useAtomValue } from 'jotai'

import { getToken } from '~/lib/cookie'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { adminUrlAtom } from '../url'

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
