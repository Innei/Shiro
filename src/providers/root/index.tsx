'use client'

import { ReactQueryProvider } from './react-query-provider'
import { Provider as BalancerProvider } from 'react-wrap-balancer'
import { LazyMotion } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

import { ProviderComposer } from '../../components/common/ProviderComposer'
import { AccentColorProvider } from './accent-color-provider'
import { DebugProvider } from './debug-provider'
import { EventProvider } from './event-provider'
import { JotaiStoreProvider } from './jotai-provider'
import { ModalStackProvider } from './modal-stack-provider'
import { PageScrollInfoProvider } from './page-scroll-info-provider'
import { SentryProvider } from './sentry-provider'
import { SocketContainer } from './socket-provider'

const loadFeatures = () =>
  import('./framer-lazy-feature').then((res) => res.default)
const contexts: JSX.Element[] = [
  <ThemeProvider key="themeProvider" />,
  <ReactQueryProvider key="reactQueryProvider" />,
  <JotaiStoreProvider key="jotaiStoreProvider" />,

  <BalancerProvider key="balancerProvider" />,
  <LazyMotion features={loadFeatures} strict key="framer" />,
]
export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <ProviderComposer contexts={contexts}>
        {children}
        <SocketContainer />
        <ModalStackProvider key="modalStackProvider" />
        <EventProvider key="viewportProvider" />
        <SentryProvider key="SentryProvider" />
        <PageScrollInfoProvider key="PageScrollInfoProvider" />
        <DebugProvider key="debugProvider" />
        <AccentColorProvider />
      </ProviderComposer>
    </>
  )
}
