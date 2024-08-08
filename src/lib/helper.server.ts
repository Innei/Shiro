import 'server-only'

import { headers } from 'next/headers'
import uniqolor from 'uniqolor'

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

export const getBackgroundGradient = (seed: string) => {
  const bgAccent = uniqolor(seed, {
    saturation: [30, 35],
    lightness: [60, 70],
  }).color

  const bgAccentLight = uniqolor(seed, {
    saturation: [30, 35],
    lightness: [80, 90],
  }).color

  const bgAccentUltraLight = uniqolor(seed, {
    saturation: [30, 35],
    lightness: [95, 96],
  }).color

  return [bgAccent, bgAccentLight, bgAccentUltraLight]
}
