import { isServer } from '@tanstack/react-query'
import { headers } from 'next/dist/client/components/headers'

import { $axios } from '~/utils/request'

import PKG from '../../package.json'

export const attachUA = () => {
  if (!isServer) return
  const { get } = headers()

  const ua = get('user-agent')
  $axios.defaults.headers.common[
    'User-Agent'
  ] = `${ua} NextJS/v${PKG.dependencies.next} ${PKG.name}/${PKG.version}`
}
