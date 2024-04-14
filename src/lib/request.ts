import { nanoid } from 'nanoid'
import { createFetch } from 'ofetch'
import type { IRequestAdapter } from '@mx-space/api-client'

import { allControllers, createClient } from '@mx-space/api-client'

import { isLogged } from '~/atoms'
import { API_URL } from '~/constants/env'

import PKG from '../../package.json'
import { getToken } from './cookie'
import { isDev, isServerSide } from './env'

const uuidStorageKey = 'x-uuid'
const uuid = nanoid()

const globalConfigureHeader = {} as any
const globalConfigureSearchParams = {} as any

if (isServerSide) {
  globalConfigureHeader['User-Agent'] =
    `NextJS/v${PKG.dependencies.next} ${PKG.name}/${PKG.version}`
}

const $fetch = createFetch({
  defaults: {
    timeout: 8000,
    // next: { revalidate: 3 },
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

      context.options.params ??= {}
      Object.assign(context.options.params, globalConfigureSearchParams)
      if (context.options.params.token) {
        context.options.cache = 'no-store'
      }
      if (isDev && isServerSide) {
        // eslint-disable-next-line no-console
        console.log(`[Request]: ${context.request}`)
      }
    },
    onResponse(context) {
      // log response
      if (isDev && isServerSide) {
        // eslint-disable-next-line no-console
        console.log(`[Response]: ${context.request}`, context.response.status)
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

export const attachFetchHeader = (key: string, value: string | null) => {
  const original = globalConfigureHeader[key]
  if (value === null) {
    delete globalConfigureHeader[key]
  } else {
    globalConfigureHeader[key] = value
  }

  return () => {
    if (typeof original === 'undefined') {
      delete globalConfigureHeader[key]
    } else {
      globalConfigureHeader[key] = original
    }
  }
}

export const setGlobalSearchParams = (params: Record<string, any>) => {
  clearGlobalSearchParams()
  Object.assign(globalConfigureSearchParams, params)
}

export const clearGlobalSearchParams = () => {
  Object.keys(globalConfigureSearchParams).forEach((key) => {
    delete globalConfigureSearchParams[key]
  })
}
