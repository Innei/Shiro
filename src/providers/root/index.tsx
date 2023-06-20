'use client'

import { ReactQueryProvider } from './react-query-provider'
import { ThemeProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

import { ProviderComposer } from '../../components/common/ProviderComposer'
import { AggregationProvider } from './aggregation-data-provider'
import { DebugProvider } from './debug-provider'
import { JotaiStoreProvider } from './jotai-provider'
import { ModalStackProvider } from './modal-stack-provider'
import { PageScrollInfoProvider } from './page-scroll-info-provider'
import { SentryProvider } from './sentry-provider'
import { SocketContainer } from './socket-provider'
import { ViewportProvider } from './viewport-provider'

const contexts: JSX.Element[] = [
  <SentryProvider key="SentryProvider" />,
  <ThemeProvider key="themeProvider" />,
  <ReactQueryProvider key="reactQueryProvider" />,
  <JotaiStoreProvider key="jotaiStoreProvider" />,
  <AggregationProvider key="aggregationProvider" />,
  <ViewportProvider key="viewportProvider" />,

  <PageScrollInfoProvider key="PageScrollInfoProvider" />,
  <DebugProvider key="debugProvider" />,
  <ModalStackProvider key="modalStackProvider" />,
]
export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <SocketContainer />
      <ProviderComposer contexts={contexts}>{children}</ProviderComposer>
    </>
  )
}
