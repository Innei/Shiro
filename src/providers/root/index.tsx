'use client'

import {
  ReactQueryProvider,
  ReactQueryProviderForDashboard,
} from './react-query-provider'
import { Fragment, useState } from 'react'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { LazyMotion } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import type { JSX, PropsWithChildren } from 'react'

import { pageScrollElementAtom } from '~/atoms'
import { useIsMobile } from '~/atoms/hooks'
import { PeekPortal } from '~/components/modules/peek/PeekPortal'
import { ModalStackProvider } from '~/components/ui/modal'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useBeforeUnload } from '~/hooks/common/use-before-unload'
import { isDev } from '~/lib/env'
import { jotaiStore } from '~/lib/store'

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
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()

  useIsomorphicLayoutEffect(() => {
    if (!isMobile) {
      jotaiStore.set(pageScrollElementAtom, scrollRef)
    } else {
      jotaiStore.set(pageScrollElementAtom, null)
    }
  }, [scrollRef, isMobile])
  const Scroller = isMobile ? Fragment : ScrollArea.ScrollArea
  return (
    <ProviderComposer contexts={webappContexts}>
      <Scroller
        {...(!isMobile
          ? {
              flex: true,
              rootClassName: 'h-screen',
              ref: setScrollRef,
            }
          : undefined)}
      >
        {children}
      </Scroller>

      <SocketContainer />
      <ModalStackProvider key="modalStackProvider" />
      <EventProvider key="viewportProvider" />
      {/* <SentryProvider key="SentryProvider" /> */}
      <PageScrollInfoProvider key="PageScrollInfoProvider" />
      {isDev && <DebugProvider key="debugProvider" />}

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
