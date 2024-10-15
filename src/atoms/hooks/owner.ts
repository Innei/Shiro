import { useMutation } from '@tanstack/react-query'
import { atom, useAtomValue } from 'jotai'

import { getToken, setToken } from '~/lib/cookie'
import { apiClient } from '~/lib/request'
import { jotaiStore } from '~/lib/store'
import { aggregationDataAtom } from '~/providers/root/aggregation-data-provider'

import { isLoggedAtom } from '../owner'
import { fetchAppUrl } from '../url'

export const useOwner = () => useAtomValue(ownerAtom)
export const useRefreshToken = () =>
  useMutation({
    mutationKey: ['refreshToken'],
    mutationFn: refreshToken,
  })

export const refreshToken = async () => {
  const token = getToken()
  if (!token) return
  await apiClient.user.proxy.login.put<{ token: string }>().then((res) => {
    setIsLogged(true)

    setToken(res.token)
  })

  await fetchAppUrl()
}

export const ownerAtom = atom((get) => get(aggregationDataAtom)?.user)

export const useIsLogged = () => useAtomValue(isLoggedAtom)

export const setIsLogged = (isLogged: boolean) => {
  jotaiStore.set(isLoggedAtom, isLogged)
}

export const isLogged = () => jotaiStore.get(isLoggedAtom)
