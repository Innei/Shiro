import { atom } from 'jotai'

import { jotaiStore } from '~/lib/store'
import { toast } from '~/lib/toast'
import { aggregationDataAtom } from '~/providers/root/aggregation-data-provider'
import { getToken, removeToken, setToken } from '~/utils/cookie'
import { apiClient } from '~/utils/request'

const ownerAtom = atom((get) => {
  return get(aggregationDataAtom)?.user
})
const tokenAtom = atom(null as string | null)

export const login = async () => {
  const token = getToken()
  if (!token) {
    return
  }
  const validated = await apiClient.user
    .checkTokenValid(token)
    .then((res) => !!res.ok)

    .catch(() => {
      removeToken()
      toast('登录身份过期了，再登录一下吧！', 'warning')
      return false
    })

  if (!validated) return

  apiClient.user.proxy.login.put<{ token: string }>().then((res) => {
    jotaiStore.set(tokenAtom, res.token)
    toast(`欢迎回来，${jotaiStore.get(ownerAtom)?.name}`, 'success')
    setToken(res.token)
  })
}
