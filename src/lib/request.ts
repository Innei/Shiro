import type { AxiosError, AxiosInstance } from 'axios'

import {
  allControllers,
  createClient,
  RequestError,
} from '@mx-space/api-client'
import { axiosAdaptor } from '@mx-space/api-client/dist/adaptors/axios'

import { isLogged } from '~/atoms'
import { API_URL } from '~/constants/env'

import PKG from '../../package.json'
import { getToken } from './cookie'
import { isClientSide, isDev, isServerSide } from './env'

const uuidStorageKey = 'x-uuid'
const genUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
const uuid = genUUID()

if (isClientSide) {
  if (!sessionStorage.getItem(uuidStorageKey))
    sessionStorage.setItem(uuidStorageKey, uuid)
}

export const apiClient = createClient(axiosAdaptor)(API_URL, {
  controllers: allControllers,
})

export const $axios = axiosAdaptor.default as AxiosInstance

$axios.defaults.timeout = 8000

if (typeof window === 'undefined')
  $axios.defaults.headers.common['User-Agent'] =
    `NextJS/v${PKG.dependencies.next} ${PKG.name}/${PKG.version}`

$axios.interceptors.request.use((config) => {
  const token = getToken()
  if (config.headers) {
    if (token) {
      config.headers['Authorization'] = `bearer ${token}`
    }
    config.headers['x-session-uuid'] =
      globalThis?.sessionStorage?.getItem(uuidStorageKey) ?? uuid
  }

  if (isLogged()) {
    config.params = {
      ...config.params,
      ts: Date.now(),
    }
  }

  if (isDev && isServerSide) {
    console.log(`[Request]: ${config.url}`)
  }

  return config
})

export const getErrorMessageFromRequestError = (error: RequestError) => {
  if (!(error instanceof RequestError)) return (error as Error).message
  const axiosError = error.raw as AxiosError
  const messagesOrMessage = (axiosError.response?.data as any)?.message
  const bizMessage =
    typeof messagesOrMessage === 'string'
      ? messagesOrMessage
      : Array.isArray(messagesOrMessage)
        ? messagesOrMessage[0]
        : undefined

  return bizMessage || axiosError.message
}
