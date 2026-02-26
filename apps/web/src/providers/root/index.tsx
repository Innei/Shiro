'use client'

import { LazyMotion, MotionConfig } from 'motion/react'
import { ThemeProvider } from 'next-themes'
import type { JSX, PropsWithChildren } from 'react'

import { PeekPortal } from '~/components/modules/peek/PeekPortal'
import { ModalStackProvider } from '~/components/ui/modal'
import { Toaster } from '~/components/ui/toast'
import { Spring } from '~/constants/spring'
import { BeforeUnloadProvider } from '~/hooks/common/use-before-unload'
import { isDev } from '~/lib/env'

import { ProviderComposer } from '../../components/common/ProviderComposer'
import { AuthProvider } from './auth-provider'
import { AuthSessionProvider } from './auth-session-provider'
import { DebugProvider } from './debug-provider'
import { EventProvider } from './event-provider'
import { ImmersiveReadingInteractionProvider } from './immersive-reading-interaction-provider'
import { IntlProvider } from './intl-provider'
import { JotaiStoreProvider } from './jotai-provider'
import { LangSyncProvider } from './lang-sync-provider'
import { PageScrollInfoProvider } from './page-scroll-info-provider'
import {
  ReactQueryProvider,
  ReactQueryProviderForDashboard,
} from './react-query-provider'
import { ReadingStateResetProvider } from './reading-state-provider'
import { SocketContainer } from './socket-provider'

const loadFeatures = () =>
  import('./framer-lazy-feature').then((res) => res.default)

const baseContexts: JSX.Element[] = [
  <ThemeProvider key="themeProvider" />,
  <JotaiStoreProvider key="jotaiStoreProvider" />,

  <LazyMotion features={loadFeatures} strict key="framer" />,

  <AuthSessionProvider key="authSessionProvider" />,
]

const webappContexts: JSX.Element[] = [
  <LangSyncProvider key="langSyncProvider" />,
  <ReactQueryProvider key="reactQueryProvider" />,
  ...baseContexts,
]

export function WebAppProviders({ children }: PropsWithChildren) {
  return (
    <ProviderComposer contexts={webappContexts}>
      <MotionConfig transition={Spring.presets.smooth}>{children}</MotionConfig>

      <SocketContainer />
      <ModalStackProvider key="modalStackProvider" />
      <EventProvider key="viewportProvider" />
      <PageScrollInfoProvider key="PageScrollInfoProvider" />
      <ReadingStateResetProvider key="readingStateResetProvider" />
      <ImmersiveReadingInteractionProvider key="immersiveReadingInteractionProvider" />
      {isDev && <DebugProvider key="debugProvider" />}
      <Toaster />
      <PeekPortal />
    </ProviderComposer>
  )
}
const dashboardContexts: JSX.Element[] = [
  <IntlProvider key="intlProvider" />,
  <LangSyncProvider key="langSyncProvider" />,
  <ReactQueryProviderForDashboard key="reactQueryProvider" />,
  <AuthProvider key="auth" />,
  <BeforeUnloadProvider key="useBeforeUnloadProvider" />,
  ...baseContexts,
]
export function DashboardAppProviders({ children }: PropsWithChildren) {
  return (
    <ProviderComposer contexts={dashboardContexts}>
      {children}

      <ModalStackProvider key="modalStackProvider" />
      <EventProvider key="viewportProvider" />
      <PeekPortal />
      <Toaster />
      {/* <DebugProvider key="debugProvider" /> */}
    </ProviderComposer>
  )
}
