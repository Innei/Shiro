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
      toast.success(`欢迎回来，${jotaiStore.get(ownerAtom)?.name}`)
    }

    return true
  }

  const token = getToken()
  if (!token) {
    return
  }
  const outdateToast = () =>
    toast.message('登录身份过期了，再登录一下吧！', {
      action: {
        label: '登录',
        onClick: () => {
          window.location.href = '/login'
        },
      },
    })
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
    removeToken()
    return
  }

  await apiClient.user.proxy.login.put<{ token: string }>().then((res) => {
    jotaiStore.set(isLoggedAtom, true)
    toast.message(`欢迎回来，${jotaiStore.get(ownerAtom)?.name}`)
    setToken(res.token)
  })

  return true
}

export const useIsLogged = () => useAtomValue(isLoggedAtom)

export const isLogged = () => jotaiStore.get(isLoggedAtom)
