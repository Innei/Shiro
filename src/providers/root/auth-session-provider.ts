import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { setSessionReader } from '~/atoms/hooks/reader'
import type { SessionReader } from '~/models/session'

declare module 'next-auth' {
  export interface Session extends SessionReader {}
}

export const AuthSessionProvider: Component = ({ children }) => {
  const session = useSession()

  useEffect(() => {
    setSessionReader(session.data)
  }, [session.data])
  return children
}
