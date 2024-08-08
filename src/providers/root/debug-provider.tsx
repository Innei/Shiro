'use client'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense } from 'react'
import type { PropsWithChildren, ReactElement } from 'react'

import { DevIndicator } from '~/components/common/DevIndicator'

export const DebugProvider = ({
  children,
}: PropsWithChildren): ReactElement => (
  <>
    <Suspense>
      <div data-hide-print>
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <DevIndicator />
      </div>
    </Suspense>
    {children}
  </>
)
