import { nanoid } from 'nanoid'
import { createFetch } from 'ofetch'
import type { IRequestAdapter } from '@mx-space/api-client'
import type { FetchError } from 'ofetch'

import {
  allControllers,
  createClient,
  RequestError,
} from '@mx-space/api-client'

import { isLogged } from '~/atoms'
import { API_URL } from '~/constants/env'

import PKG from '../../package.json'
import { getToken } from './cookie'
import { isDev, isServerSide } from './env'

const uuidStorageKey = 'x-uuid'
const uuid = nanoid()

const globalConfigureHeader = {} as any

if (isServerSide) {
  globalConfigureHeader['User-Agent'] =
    `NextJS/v${PKG.dependencies.next} ${PKG.name}/${PKG.version}`
}

const $fetch = createFetch({
  defaults: {
    timeout: 8000,
    headers: globalConfigureHeader,
    onRequest(context) {
      const token = getToken()
      const headers: any = context.options.headers ?? {}
      if (token) {
        headers['Authorization'] = `bearer ${token}`
      }
      headers['x-session-uuid'] =
        globalThis?.sessionStorage?.getItem(uuidStorageKey) ?? uuid

      if (isLogged()) {
        context.options.params = {
          ...context.options.params,
          ts: Date.now(),
        }
      }

      if (isDev && isServerSide) {
        // eslint-disable-next-line no-console
        console.log(`[Request]: ${context.request}`)
      }
    },
  },
})

const fetchAdapter: IRequestAdapter<typeof $fetch> = {
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
}

export const apiClient = createClient(fetchAdapter)(API_URL, {
  controllers: allControllers,
  getDataFromResponse(response) {
    return response as any
  },
})

export const attachFetchHeader = (key: string, value: string) => {
  const original = globalConfigureHeader[key]
  globalConfigureHeader[key] = value

  return () => {
    if (typeof original === 'undefined') {
      delete globalConfigureHeader[key]
    } else {
      globalConfigureHeader[key] = original
    }
  }
}

export const getErrorMessageFromRequestError = (error: RequestError) => {
  if (!(error instanceof RequestError)) return (error as Error).message
  const fetchError = error.raw as FetchError
  const messagesOrMessage = fetchError.response?._data?.message
  const bizMessage =
    typeof messagesOrMessage === 'string'
      ? messagesOrMessage
      : Array.isArray(messagesOrMessage)
        ? messagesOrMessage[0]
        : undefined

  return bizMessage || fetchError.message
}
