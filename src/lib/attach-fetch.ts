import 'server-only'

import { cookies, headers } from 'next/headers'

import PKG from '../../package.json'
import { AuthKeyNames } from './cookie'
import { attachFetchHeader } from './request'

export const attachServerFetch = async () => {
  const requestHeaders = await headers()

  const ua = requestHeaders.get('user-agent')
  const ip =
    requestHeaders.get('x-real-ip') ||
    requestHeaders.get('x-forwarded-for') ||
    requestHeaders.get('remote-addr') ||
    requestHeaders.get('cf-connecting-ip')

  if (ip) {
    attachFetchHeader('x-real-ip', ip)
    attachFetchHeader('x-forwarded-for', ip)
  }
  attachFetchHeader(
    'User-Agent',
    `${ua} NextJS/v${PKG.dependencies.next} ${PKG.name}/${PKG.version}`,
  )
}

export const getAuthFromCookie = async () => {
  const cookie = await cookies()
  const jwt = cookie.get(AuthKeyNames[0])

  return jwt?.value || ''
}
