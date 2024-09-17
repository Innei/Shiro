'use client'

import { LazyMotion } from 'framer-motion'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import type { JSX, PropsWithChildren } from 'react'

import { PeekPortal } from '~/components/modules/peek/PeekPortal'
import { ModalStackProvider } from '~/components/ui/modal'
import { API_URL } from '~/constants/env'
import { useBeforeUnload } from '~/hooks/common/use-before-unload'

import { ProviderComposer } from '../../components/common/ProviderComposer'
import { AuthProvider } from './auth-provider'
import { AuthSessionProvider } from './auth-session-provider'
import { DebugProvider } from './debug-provider'
import { EventProvider } from './event-provider'
import { JotaiStoreProvider } from './jotai-provider'
import { PageScrollInfoProvider } from './page-scroll-info-provider'
import {
  ReactQueryProvider,
  ReactQueryProviderForDashboard,
} from './react-query-provider'
import { SocketContainer } from './socket-provider'

const loadFeatures = () =>
  import('./framer-lazy-feature').then((res) => res.default)

const baseContexts: JSX.Element[] = [
  // @ts-expect-error
  <ThemeProvider key="themeProvider" />,
  <JotaiStoreProvider key="jotaiStoreProvider" />,

  <LazyMotion features={loadFeatures} strict key="framer" />,
  // @ts-expect-error
  <SessionProvider basePath={`${API_URL}/auth`} key="sessionProvider" />,

  <AuthSessionProvider key="authSessionProvider" />,
]

const webappContexts: JSX.Element[] = [
  <ReactQueryProvider key="reactQueryProvider" />,
  ...baseContexts,
]

export function WebAppProviders({ children }: PropsWithChildren) {
  return (
    <ProviderComposer contexts={webappContexts}>
      {children}

      <SocketContainer />
      <ModalStackProvider key="modalStackProvider" />
      <EventProvider key="viewportProvider" />
      <PageScrollInfoProvider key="PageScrollInfoProvider" />
      <DebugProvider key="debugProvider" />

      <PeekPortal />
    </ProviderComposer>
  )
}
const dashboardContexts: JSX.Element[] = [
  <ReactQueryProviderForDashboard key="reactQueryProvider" />,
  <AuthProvider key="auth" />,
  <useBeforeUnload.Provider key="useBeforeUnloadProvider" />,
  ...baseContexts,
]
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
