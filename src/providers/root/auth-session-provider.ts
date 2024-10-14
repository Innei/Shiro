import { simpleCamelcaseKeys } from '@mx-space/api-client'
import { useOpenPanel } from '@openpanel/nextjs'
import { useQuery } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import type { AdapterUser } from 'next-auth/adapters'
import { useEffect } from 'react'

import { fetchAppUrl, isLoggedAtom } from '~/atoms'
import { setSessionReader } from '~/atoms/hooks/reader'
import { apiClient } from '~/lib/request'
import { jotaiStore } from '~/lib/store'
import type { SessionReader } from '~/models/session'

declare module 'next-auth' {
  export interface Session extends SessionReader {}
}

export const AuthSessionProvider: Component = ({ children }) => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    refetchOnMount: 'always',
    queryFn: () =>
      apiClient.proxy.auth.session.get<AdapterUser>({
        params: {
          r: nanoid(),
        },
      }),
  })
  const { identify } = useOpenPanel()
  useEffect(() => {
    if (!session) return
    const transformedData = simpleCamelcaseKeys(session)
    setSessionReader(transformedData)
    if (transformedData.isOwner) {
      jotaiStore.set(isLoggedAtom, true)
      fetchAppUrl()
    }
    identify({
      profileId: transformedData.id,
      email: transformedData.email,
      lastName: transformedData.name,
      avatar: transformedData.avatar,
    })
  }, [session])
  return children
}
