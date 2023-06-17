'use client'

import { ReactQueryProvider } from './react-query-provider'
import { ThemeProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

import { ProviderComposer } from '../../components/common/ProviderComposer'
import { AggregationProvider } from './aggregation-data-provider'
import { DebugProvider } from './debug-provider'
import { JotaiStoreProvider } from './jotai-provider'
import { PageScrollInfoProvider } from './page-scroll-info-provider'
import { SocketProvider } from './socket-provider'
import { ViewportProvider } from './viewport-provider'

const contexts: JSX.Element[] = [
  <ThemeProvider key="themeProvider" />,
  <ReactQueryProvider key="reactQueryProvider" />,
  <JotaiStoreProvider key="jotaiStoreProvider" />,
  <AggregationProvider key="aggregationProvider" />,
  <ViewportProvider key="viewportProvider" />,
  <SocketProvider key="socketProvider" />,
  <PageScrollInfoProvider key="PageScrollInfoProvider" />,
  <DebugProvider key="debugProvider" />,
]
export function Providers({ children }: PropsWithChildren) {
  return <ProviderComposer contexts={contexts}>{children}</ProviderComposer>
}
