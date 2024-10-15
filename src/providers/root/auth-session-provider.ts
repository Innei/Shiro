import { simpleCamelcaseKeys } from '@mx-space/api-client'
import { useOpenPanel } from '@openpanel/nextjs'
import { useQuery } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import type { AdapterUser } from 'next-auth/adapters'
import { useEffect } from 'react'

import { fetchAppUrl } from '~/atoms'
import { setIsLogged } from '~/atoms/hooks/owner'
import { setSessionReader } from '~/atoms/hooks/reader'
import { apiClient } from '~/lib/request'
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
    if (!session) {
      setIsLogged(false)
      setSessionReader(null)
      return
    }
    const transformedData = simpleCamelcaseKeys(session)
    setSessionReader(transformedData)
    if (transformedData.isOwner) {
      setIsLogged(true)
      fetchAppUrl()
    }
    identify({
      profileId: transformedData.id,
      email: transformedData.email,
      lastName: transformedData.name,
      avatar: transformedData.avatar,
    })
  }, [identify, session])
  return children
}
