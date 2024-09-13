import type { IRequestAdapter } from '@mx-space/api-client'
import createClient, { allControllers } from '@mx-space/api-client'
import Cookies from 'js-cookie'
import type { $fetch } from 'ofetch'

import { API_URL } from '~/constants/env'

type FetchType = typeof $fetch
export const createFetchAdapter = (
  $fetch: FetchType,
): IRequestAdapter<typeof $fetch> => ({
  default: $fetch,
  get(url: string, options) {
    const { params } = options || {}
    return $fetch(url, {
      method: 'GET',
      query: params,
    })
  },
  post(url: string, options) {
    const { params, data } = options || {}
    return $fetch(url, {
      method: 'post',
      query: params,
      body: data,
    })
  },
  put(url: string, options) {
    const { params, data } = options || {}
    return $fetch(url, {
      method: 'put',
      query: params,
      body: data,
    })
  },
  patch(url: string, options) {
    const { params, data } = options || {}
    return $fetch(url, {
      method: 'patch',
      query: params,
      body: data,
    })
  },
  delete(url: string, options) {
    const { params, data } = options || {}
    return $fetch(url, {
      method: 'delete',
      query: params,
      body: data,
    })
  },
})
export const createApiClient = (
  fetchAdapter: ReturnType<typeof createFetchAdapter>,
) =>
  createClient(fetchAdapter)(API_URL, {
    controllers: allControllers,
    getDataFromResponse(response) {
      return response as any
    },
  })

export const TokenKey = 'mx-token'

export const AuthKeyNames = [TokenKey]

export function getToken(): string | null {
  const token = Cookies.get(TokenKey)

  return token || null
}
