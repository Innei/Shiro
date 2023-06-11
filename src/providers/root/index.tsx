'use client'

import { ReactQueryProvider } from './react-query-provider'
import React from 'react'
import { ThemeProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

import { DebugProvider } from './debug-provider'
import { JotaiStoreProvider } from './jotai-provider'
import { ViewportProvider } from './viewport-provider'

const ProviderComposer: Component<{
  contexts: JSX.Element[]
}> = ({ contexts, children }) => {
  return contexts.reduceRight((kids: any, parent: any) => {
    return React.cloneElement(parent, { children: kids })
  }, children)
}

const contexts: JSX.Element[] = [
  <ThemeProvider attribute="class" key="themeProvider" />,
  <ReactQueryProvider key="reactQueryProvider" />,
  <JotaiStoreProvider key="jotaiStoreProvider" />,
  <ViewportProvider key="viewportProvider" />,
  <DebugProvider key="debugProvider" />,
]
export function Providers({ children }: PropsWithChildren) {
  return <ProviderComposer contexts={contexts}>{children}</ProviderComposer>
}
