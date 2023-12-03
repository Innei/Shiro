import { atom, useAtomValue } from 'jotai'

import { getToken, removeToken, setToken } from '~/lib/cookie'
import { apiClient } from '~/lib/request'
import { jotaiStore } from '~/lib/store'
import { toast } from '~/lib/toast'
import { aggregationDataAtom } from '~/providers/root/aggregation-data-provider'

import { fetchAppUrl } from './url'

const ownerAtom = atom((get) => {
  return get(aggregationDataAtom)?.user
})
const isLoggedAtom = atom(false)

export const login = async (username?: string, password?: string) => {
  if (username && password) {
    const user = await apiClient.user.login(username, password).catch((err) => {
      console.error(err)
      toast.error('再试试哦')
      throw err
    })
    if (user) {
      const token = user.token
      setToken(token)
      jotaiStore.set(isLoggedAtom, true)

      await fetchAppUrl()
      toast(`欢迎回来，${jotaiStore.get(ownerAtom)?.name}`, 'success')
    }

    return true
  }

  const token = getToken()
  if (!token) {
    return
  }
  // const outdateToast = () => toast.warn('登录身份过期了，再登录一下吧！')
  const validated = await apiClient.user
    .checkTokenValid(token)
    .then((res) => !!res.ok)

    .catch(() => {
      removeToken()
      // outdateToast()
      return false
    })

  if (!validated) {
    // outdateToast()
    removeToken()
    return
  }

  await refreshToken()
  toast(`欢迎回来，${jotaiStore.get(ownerAtom)?.name}`, 'success')

  return true
}

export const useIsLogged = () => useAtomValue(isLoggedAtom)

export const isLogged = () => jotaiStore.get(isLoggedAtom)

export const refreshToken = async () => {
  const token = getToken()
  if (!token) return
  await apiClient.user.proxy.login.put<{ token: string }>().then((res) => {
    jotaiStore.set(isLoggedAtom, true)

    setToken(res.token)
  })

  await fetchAppUrl()
}
