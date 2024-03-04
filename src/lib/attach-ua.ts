import { isServer } from '@tanstack/react-query'
import { headers } from 'next/headers'

import { $axios } from '~/lib/request'

import PKG from '../../package.json'

export const attachUAAndRealIp = () => {
  if (!isServer) return
  const { get } = headers()

  const ua = get('user-agent')
  const ip =
    get('x-real-ip') ||
    get('x-forwarded-for') ||
    get('remote-addr') ||
    get('cf-connecting-ip')
  $axios.defaults.headers.common['X-Real-IP'] = ip
  $axios.defaults.headers.common['X-Forwarded-For'] = ip
  $axios.defaults.headers.common['User-Agent'] =
    `${ua} NextJS/v${PKG.dependencies.next} ${PKG.name}/${PKG.version}`
}
