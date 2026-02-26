'use client'

import { setIsOwnerLogged } from '~/atoms/hooks/owner'
import { isClientSide } from '~/lib/env'

export const HydrateuserAuthProvider = (props: { isLogged: boolean }) => {
  if (props.isLogged && isClientSide) {
    setIsOwnerLogged(true)
  }
  return null
}
