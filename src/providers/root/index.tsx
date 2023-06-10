'use client'

import { ReactQueryProvider } from './react-query-provider'
import { ThemeProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

import { DebugProvider } from './debug-provider'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class">
      <ReactQueryProvider>
        <DebugProvider>{children}</DebugProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  )
}
