import { headers } from 'next/headers'

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

export const getOgUrl = (type: 'post' | 'note' | 'page', data: any) => {
  const host = headers().get('host')
  const ogUrl = new URL(`${isDev ? 'http' : 'https'}://${host}/og`)
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
