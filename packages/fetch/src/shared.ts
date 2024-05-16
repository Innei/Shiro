import Cookies from 'js-cookie'
import type { IRequestAdapter } from '@mx-space/api-client'
import type { $fetch } from 'ofetch'

import createClient, { allControllers } from '@mx-space/api-client'

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

export const ClerkCookieKey = '__session'
export const AuthKeyNames = [TokenKey, ClerkCookieKey]

export function getToken(): string | null {
  // FUCK clerk constants not export, and mark it internal and can not custom
  // packages/backend/src/constants.ts
  const clerkJwt = Cookies.get(ClerkCookieKey)

  const token = Cookies.get(TokenKey) || clerkJwt

  return token || null
}
