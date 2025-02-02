import { atom } from 'jotai'

import { getToken, removeToken, setToken } from '~/lib/cookie'
import { apiClient } from '~/lib/request'
import { jotaiStore } from '~/lib/store'
import { toast } from '~/lib/toast'

import { ownerAtom, refreshToken, setIsLogged } from './hooks/owner'
import { fetchAppUrl } from './url'

export const isLoggedAtom = atom(false)

export const login = async (username?: string, password?: string) => {
  if (username && password) {
    const user = await apiClient.user.login(username, password).catch((err) => {
      console.error(err)
      toast.error('再试试哦')
      throw err
    })
    if (user) {
      const { token } = user
      setToken(token)
      setIsLogged(true)

      await fetchAppUrl()
      toast.success(`欢迎回来，${jotaiStore.get(ownerAtom)?.name}`)
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

  if (token) await refreshToken()

  return true
}
