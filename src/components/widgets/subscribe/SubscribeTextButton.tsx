'use client'

import type { FC, PropsWithChildren } from 'react'

import { useIsEnableSubscribe, usePresentSubscribeModal } from './hooks'

export const SubscribeTextButton: FC<PropsWithChildren> = ({ children }) => {
  const canSubscribe = useIsEnableSubscribe()
  const { present } = usePresentSubscribeModal()

  if (!canSubscribe) {
    return null
  }

  return (
    <>
      <span>
        <button onClick={present}>订阅</button>
      </span>
      {children}
    </>
  )
}
