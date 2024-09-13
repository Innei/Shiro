import { simpleCamelcaseKeys } from '@mx-space/api-client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { isLoggedAtom } from '~/atoms'
import { setSessionReader } from '~/atoms/hooks/reader'
import { jotaiStore } from '~/lib/store'
import type { SessionReader } from '~/models/session'

declare module 'next-auth' {
  export interface Session extends SessionReader {}
}

export const AuthSessionProvider: Component = ({ children }) => {
  const session = useSession()

  useEffect(() => {
    if (!session.data) return
    const transformedData = simpleCamelcaseKeys(session.data)
    setSessionReader(transformedData)
    if (transformedData.isOwner) jotaiStore.set(isLoggedAtom, true)
  }, [session.data])
  return children
}
