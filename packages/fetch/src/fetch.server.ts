import 'server-only'

import { nanoid } from 'nanoid'
import type {
  UnsafeUnwrappedCookies,
  UnsafeUnwrappedHeaders,
} from 'next/headers'
import { cookies, headers as nextHeaders } from 'next/headers'
import { createFetch } from 'ofetch'

import PKG from '~/../package.json'

import { createApiClient, createFetchAdapter, TokenKey } from './shared'

const isDev = process.env.NODE_ENV === 'development'

export const getAuthToken = async () => {
  const cookie = await cookies()

  const token = cookie.get(TokenKey)?.value

  return token
}
export const $fetch = createFetch({
  defaults: {
    timeout: 8000,
    credentials: 'include',
    async onRequest(context) {
      const cookie = await cookies()

      const token = cookie.get(TokenKey)?.value

      // eslint-disable-next-line prefer-destructuring
      let headers: any = context.options.headers
      if (headers && headers instanceof Headers) {
        headers = Object.fromEntries(headers.entries())
      } else {
        headers = {}
      }
      if (token) {
        headers['Authorization'] = `bearer ${token}`
      }

      context.options.params ??= {}

      if (token) {
        context.options.params.r = nanoid()
      }

      if (context.options.params.token || token) {
        context.options.cache = 'no-store'
      }
      if (isDev) {
        console.info(`[Request/Server]: ${context.request}`)
      }

      const { get } = await nextHeaders()

      const ua = get('user-agent')
      const ip =
        get('x-real-ip') ||
        get('x-forwarded-for') ||
        get('remote-addr') ||
        get('cf-connecting-ip')

      if (ip) {
        headers['x-real-ip'] = ip
        headers['x-forwarded-for'] = ip
      }

      headers['User-Agent'] =
        `${ua} NextJS/v${PKG.dependencies.next} ${PKG.name}/${PKG.version}`

      context.options.headers = headers
    },
    onResponse(context) {
      if (isDev) {
        console.info(
          `[Response/Server]: ${context.request}`,
          context.response.status,
        )
      }
    },
  },
})
export const apiClient = createApiClient(createFetchAdapter($fetch))

const Noop = () => null
export const attachFetchHeader = () => Noop

export const setGlobalSearchParams = Noop
export const clearGlobalSearchParams = Noop

export const isReactServer = true
