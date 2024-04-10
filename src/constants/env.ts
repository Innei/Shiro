import { env } from 'next-runtime-env'

import { isClientSide, isDev } from '~/lib/env'

export const API_URL: string = (() => {
  if (isDev) return env('NEXT_PUBLIC_API_URL') || ''

  if (isClientSide && env('NEXT_PUBLIC_CLIENT_API_URL')) {
    return env('NEXT_PUBLIC_CLIENT_API_URL') || ''
  }

  return env('NEXT_PUBLIC_API_URL') || '/api/v2'
})() as string
export const GATEWAY_URL = env('NEXT_PUBLIC_GATEWAY_URL') || ''
