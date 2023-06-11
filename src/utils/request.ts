import type { AxiosInstance } from 'axios'

import { allControllers, createClient } from '@mx-space/api-client'
import { axiosAdaptor } from '@mx-space/api-client/dist/adaptors/axios'

import { API_URL } from '~/constants/env'

import PKG from '../../package.json'
import { getToken } from './cookie'
import { isDev } from './env'

const genUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
const uuid = genUUID()

export const apiClient = createClient(axiosAdaptor)(API_URL, {
  controllers: allControllers,
})

export const $axios = axiosAdaptor.default as AxiosInstance

$axios.defaults.timeout = 10000

if (typeof window === 'undefined')
  $axios.defaults.headers.common[
    'User-Agent'
  ] = `NextJS/v${PKG.dependencies.next} ${PKG.name}/${PKG.version}`

$axios.interceptors.request.use((config) => {
  const token = getToken()
  if (config.headers) {
    if (token) {
      config.headers['Authorization'] = token
    }
    config.headers['x-uuid'] = uuid
  }

  if (isDev) {
    console.log(`[Request]: ${config.url}`)
  }

  return config
})
