'use client'

import {
  ReactQueryProvider,
  ReactQueryProviderForDashboard,
} from './react-query-provider'
import { LazyMotion } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import type { JSX, PropsWithChildren } from 'react'

import { PeekPortal } from '~/components/modules/peek/PeekPortal'
import { ModalStackProvider } from '~/components/ui/modal'
import { useBeforeUnload } from '~/hooks/common/use-before-unload'

import { ProviderComposer } from '../../components/common/ProviderComposer'
import { AuthProvider } from './auth-provider'
import { DebugProvider } from './debug-provider'
import { EventProvider } from './event-provider'
import { JotaiStoreProvider } from './jotai-provider'
import { PageScrollInfoProvider } from './page-scroll-info-provider'
import { SocketContainer } from './socket-provider'

const loadFeatures = () =>
  import('./framer-lazy-feature').then((res) => res.default)

const baseContexts: JSX.Element[] = [
  // @ts-expect-error
  <ThemeProvider key="themeProvider" />,
  <JotaiStoreProvider key="jotaiStoreProvider" />,

  <LazyMotion features={loadFeatures} strict key="framer" />,
]

const webappContexts: JSX.Element[] = baseContexts.concat(
  <ReactQueryProvider key="reactQueryProvider" />,
)

export function WebAppProviders({ children }: PropsWithChildren) {
  return (
    <ProviderComposer contexts={webappContexts}>
      {children}

      <SocketContainer />
      <ModalStackProvider key="modalStackProvider" />
      <EventProvider key="viewportProvider" />
      {/* <SentryProvider key="SentryProvider" /> */}
      <PageScrollInfoProvider key="PageScrollInfoProvider" />
      <DebugProvider key="debugProvider" />

      <PeekPortal />
    </ProviderComposer>
  )
}
const dashboardContexts: JSX.Element[] = baseContexts.concat(
  <ReactQueryProviderForDashboard key="reactQueryProvider" />,
  <AuthProvider key="auth" />,
  <useBeforeUnload.Provider />,
)
export function DashboardAppProviders({ children }: PropsWithChildren) {
  return (
    <ProviderComposer contexts={dashboardContexts}>
      {children}

      <ModalStackProvider key="modalStackProvider" />
      <EventProvider key="viewportProvider" />
      <PeekPortal />
      {/* <DebugProvider key="debugProvider" /> */}
    </ProviderComposer>
  )
}
