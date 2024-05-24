'use client'

import { isLoggedAtom } from '~/atoms'
import { isClientSide } from '~/lib/env'
import { jotaiStore } from '~/lib/store'

export const HydrateuserAuthProvider = (props: { isLogged: boolean }) => {
  if (props.isLogged && isClientSide) {
    jotaiStore.set(isLoggedAtom, true)
  }
  return null
}
