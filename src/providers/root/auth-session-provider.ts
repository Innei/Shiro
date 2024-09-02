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
    setSessionReader(session.data)
    if (session.data?.isOwner) jotaiStore.set(isLoggedAtom, true)
  }, [session.data])
  return children
}
