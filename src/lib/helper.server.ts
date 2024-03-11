import { headers } from 'next/dist/client/components/headers'

import { REQUEST_HOST } from '~/constants/system'

import { isDev } from './env'

export function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
    }
    return c
  })
}

export const getHost = () => {
  const header = headers()
  const host = header.get(REQUEST_HOST)

  return host
}

export const getOgUrl = (type: 'post' | 'note' | 'page', data: any) => {
  const ogUrl = new URL(`${isDev ? 'http' : 'https'}://${getHost()}/og`)
  ogUrl.searchParams.set(
    'data',
    encodeURIComponent(
      JSON.stringify({
        type,
        ...data,
      }),
    ),
  )
  return ogUrl
}
