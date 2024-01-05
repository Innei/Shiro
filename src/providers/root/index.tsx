'use client'

import {
  ReactQueryProvider,
  ReactQueryProviderForDashboard,
} from './react-query-provider'
import { Provider as BalancerProvider } from 'react-wrap-balancer'
import { LazyMotion } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

import { PeekPortal } from '~/components/modules/peek/PeekPortal'

import { ProviderComposer } from '../../components/common/ProviderComposer'
import { AccentColorProvider } from './accent-color-provider'
import { AuthProvider } from './auth-provider'
import { DebugProvider } from './debug-provider'
import { EventProvider } from './event-provider'
import { JotaiStoreProvider } from './jotai-provider'
import { ModalStackProvider } from './modal-stack-provider'
import { PageScrollInfoProvider } from './page-scroll-info-provider'
import { ScriptInjectProvider } from './script-inject-provider'
import { SocketContainer } from './socket-provider'

const loadFeatures = () =>
  import('./framer-lazy-feature').then((res) => res.default)

const baseContexts: JSX.Element[] = [
  <ThemeProvider key="themeProvider" />,

  <JotaiStoreProvider key="jotaiStoreProvider" />,

  <BalancerProvider key="balancerProvider" />,
  <LazyMotion features={loadFeatures} strict key="framer" />,
]

const webappContexts: JSX.Element[] = baseContexts.concat(
  <ReactQueryProvider key="reactQueryProvider" />,
)

export function WebAppProviders({ children }: PropsWithChildren) {
  return (
    <>
      <ProviderComposer contexts={webappContexts}>
        {children}
        <PeekPortal />
        <SocketContainer />
        <ModalStackProvider key="modalStackProvider" />
        <EventProvider key="viewportProvider" />
        {/* <SentryProvider key="SentryProvider" /> */}
        <PageScrollInfoProvider key="PageScrollInfoProvider" />
        <DebugProvider key="debugProvider" />
        <AccentColorProvider />
        <ScriptInjectProvider />
      </ProviderComposer>
    </>
  )
}
const dashboardContexts: JSX.Element[] = baseContexts.concat(
  <ReactQueryProviderForDashboard key="reactQueryProvider" />,
  <AuthProvider key="auth" />,
)
export function DashboardAppProviders({ children }: PropsWithChildren) {
  return (
    <>
      <ProviderComposer contexts={dashboardContexts}>
        {children}

        <ModalStackProvider key="modalStackProvider" />
        <EventProvider key="viewportProvider" />

        <DebugProvider key="debugProvider" />
      </ProviderComposer>
    </>
  )
}
