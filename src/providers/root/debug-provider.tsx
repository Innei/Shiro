'use client'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { PropsWithChildren, ReactElement } from 'react'
import { Suspense } from 'react'

export const DebugProvider = ({
  children,
}: PropsWithChildren): ReactElement => (
  <>
    <Suspense>
      <div data-hide-print className="hidden md:contents">
        <ReactQueryDevtools buttonPosition="top-left" />
      </div>
    </Suspense>
    {children}
  </>
)
