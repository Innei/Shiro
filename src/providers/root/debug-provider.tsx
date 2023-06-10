'use client'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense } from 'react'
import type { PropsWithChildren, ReactElement } from 'react'

export const DebugProvider = ({
  children,
}: PropsWithChildren): ReactElement => {
  return (
    <>
      <Suspense>
        <ReactQueryDevtools />
      </Suspense>
      {children}
    </>
  )
}
