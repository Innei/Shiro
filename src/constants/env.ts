import { isClientSide, isDev } from '~/lib/env'

export const API_URL = (() => {
  if (isDev) return process.env.NEXT_PUBLIC_API_URL

  if (isClientSide && process.env.NEXT_PUBLIC_CHINA_API_URL) {
    return process.env.NEXT_PUBLIC_CHINA_API_URL
  }

  return process.env.NEXT_PUBLIC_API_URL || '/api/v2'
})()
export const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || ''
