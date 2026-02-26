import 'server-only'

import chroma from 'chroma-js'
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

export const getOgUrl = async (
  type: 'post' | 'note' | 'page',
  data: any,
  locale?: string,
) => {
  const host = (await headers())?.get('host')
  const ogUrl = new URL(
    `${isDev ? 'http' : 'https'}://${host}/${locale || 'zh'}/og`,
  )
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
export const getBackgroundGradientBySeed = (seed: string) => {
  const bgAccent = uniqolor(seed, {
    saturation: [40, 55],
    lightness: [45, 55],
  }).color

  const bgAccentLight = uniqolor(seed, {
    saturation: [35, 45],
    lightness: [65, 75],
  }).color

  const bgAccentUltraLight = uniqolor(seed, {
    saturation: [25, 35],
    lightness: [80, 88],
  }).color

  return [bgAccent, bgAccentLight, bgAccentUltraLight]
}
export const getBackgroundGradientByBaseColor = (baseColor: string) => {
  const bgAccent = chroma(baseColor).set('hsl.s', 0.45).set('hsl.l', 0.5).hex()
  const bgAccentLight = chroma(baseColor)
    .set('hsl.s', 0.4)
    .set('hsl.l', 0.7)
    .hex()
  const bgAccentUltraLight = chroma(baseColor)
    .set('hsl.s', 0.3)
    .set('hsl.l', 0.85)
    .hex()

  return [bgAccent, bgAccentLight, bgAccentUltraLight]
}
