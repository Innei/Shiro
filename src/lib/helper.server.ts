import { headers } from 'next/headers'

import { isDev } from './env'

export function escapeXml(unsafe: string) {
  return unsafe.replaceAll(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': {
        return '&lt;'
      }
      case '>': {
        return '&gt;'
      }
      case '&': {
        return '&amp;'
      }
      case "'": {
        return '&apos;'
      }
      case '"': {
        return '&quot;'
      }
    }
    return c
  })
}

export const getOgUrl = async (type: 'post' | 'note' | 'page', data: any) => {
  const host =
    (await headers()).get('host') ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    'localhost:3000'

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
