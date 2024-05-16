import 'server-only'

import { cookies, headers } from 'next/headers'

import PKG from '../../package.json'
import { AuthKeyNames } from './cookie'
import { attachFetchHeader } from './request'

export const attachServerFetch = () => {
  const { get } = headers()

  const ua = get('user-agent')
  const ip =
    get('x-real-ip') ||
    get('x-forwarded-for') ||
    get('remote-addr') ||
    get('cf-connecting-ip')

  if (ip) {
    attachFetchHeader('x-real-ip', ip)
    attachFetchHeader('x-forwarded-for', ip)
  }
  attachFetchHeader(
    'User-Agent',
    `${ua} NextJS/v${PKG.dependencies.next} ${PKG.name}/${PKG.version}`,
  )
}

export const getAuthFromCookie = () => {
  const cookie = cookies()
  const jwt = cookie.get(AuthKeyNames[0])

  return jwt?.value || ''
}
