'use client'

import { setIsLogged } from '~/atoms/hooks/owner'
import { isClientSide } from '~/lib/env'

export const HydrateuserAuthProvider = (props: { isLogged: boolean }) => {
  if (props.isLogged && isClientSide) {
    setIsLogged(true)
  }
  return null
}
