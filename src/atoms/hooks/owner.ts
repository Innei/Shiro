import { useMutation } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { getToken, setToken } from '~/lib/cookie'
import { apiClient } from '~/lib/request.new'
import { jotaiStore } from '~/lib/store'

import { isLoggedAtom, ownerAtom } from '../owner'
import { fetchAppUrl } from '../url'

export const useIsLogged = () => useAtomValue(isLoggedAtom)

export const useOwner = () => useAtomValue(ownerAtom)
export const useRefreshToken = () => {
  return useMutation({
    mutationKey: ['refreshToken'],
    mutationFn: refreshToken,
  })
}

export const refreshToken = async () => {
  const token = getToken()
  if (!token) return
  await apiClient.user.proxy.login.put<{ token: string }>().then((res) => {
    jotaiStore.set(isLoggedAtom, true)

    setToken(res.token)
  })

  await fetchAppUrl()
}
