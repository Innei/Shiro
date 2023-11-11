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
        <div data-hide-print>
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </div>
      </Suspense>
      {children}
    </>
  )
}
