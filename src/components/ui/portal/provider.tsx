import { createContext, useContext } from 'react'

import { isClientSide } from '~/lib/env'

export const useRootPortal = () => {
  const ctx = useContext(RootPortalContext)
  if (!isClientSide) {
    return null
  }
  return ctx.to || document.body
}

const RootPortalContext = createContext<{
  to?: HTMLElement | undefined
}>({
  to: undefined,
})

export const RootPortalProvider = RootPortalContext.Provider
