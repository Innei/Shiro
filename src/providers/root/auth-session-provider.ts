import { simpleCamelcaseKeys } from '@mx-space/api-client'
import { useQuery } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { useEffect } from 'react'

import { fetchAppUrl, isLoggedAtom } from '~/atoms'
import { setSessionReader } from '~/atoms/hooks/reader'
import type { authClient } from '~/lib/authjs'
import { apiClient } from '~/lib/request'
import { jotaiStore } from '~/lib/store'

type AdapterUser = typeof authClient.$Infer.Session
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

  useEffect(() => {
    if (!session) return
    const transformedData = simpleCamelcaseKeys(session)
    setSessionReader(transformedData)
    if (transformedData.isOwner) {
      jotaiStore.set(isLoggedAtom, true)
      fetchAppUrl()
    }
  }, [session])
  return children
}
