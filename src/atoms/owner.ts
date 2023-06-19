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

export const login = async (username?: string, password?: string) => {
  if (username && password) {
    const user = await apiClient.user.login(username, password).catch((err) => {
      console.error(err)
      toast('再试试哦', 'error')
      return null
    })
    if (user) {
      const token = user.token
      setToken(token)
      jotaiStore.set(tokenAtom, token)

      toast(`欢迎回来，${jotaiStore.get(ownerAtom)?.name}`, 'success')
    }

    return Promise.resolve()
  }

  const token = getToken()
  if (!token) {
    return
  }
  const outdateToast = () => toast('登录身份过期了，再登录一下吧！', 'warning')
  const validated = await apiClient.user
    .checkTokenValid(token)
    .then((res) => !!res.ok)

    .catch(() => {
      removeToken()
      outdateToast()
      return false
    })

  if (!validated) {
    outdateToast()
    return
  }

  apiClient.user.proxy.login.put<{ token: string }>().then((res) => {
    jotaiStore.set(tokenAtom, res.token)
    toast(`欢迎回来，${jotaiStore.get(ownerAtom)?.name}`, 'success')
    setToken(res.token)
  })
}
