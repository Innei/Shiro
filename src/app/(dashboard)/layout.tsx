import { ToastContainer } from 'react-toastify'
import type { PropsWithChildren } from 'react'

import { ClientOnly } from '~/components/common/ClientOnly'
import { HydrationEndDetector } from '~/components/common/HydrationEndDetector'
import { LayoutHeader } from '~/components/layout/dashboard/Header'
import { ComposedKBarProvider } from '~/components/layout/dashboard/Kbar'
import { sansFont, serifFont } from '~/lib/fonts'
import { getQueryClient } from '~/lib/query-client.server'
import { DashboardAppProviders } from '~/providers/root'
import { AggregationProvider } from '~/providers/root/aggregation-data-provider'
import { queries } from '~/queries/definition'

import './dashboard.css'

import type { Viewport } from 'next'

import { MainLayout } from '~/components/modules/dashboard/layouts'
import { AccentColorStyleInjector } from '~/components/modules/shared/AccentColorStyleInjector'
import { FABContainer } from '~/components/ui/fab'

export function generateViewport(): Viewport {
  return {
    themeColor: [
      { media: '(prefers-color-scheme: dark)', color: '#000212' },
      { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    ],
    width: 'device-width',
    initialScale: 1,
    userScalable: false,
    minimumScale: 1,
    maximumScale: 1,
  }
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const queryClient = getQueryClient()
  const data = await queryClient.fetchQuery({
    ...queries.aggregation.root(),
  })

  const themeConfig = data.theme

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <title>Shiro · Light Dashboard | Powered by Mix Space</title>
        <HydrationEndDetector />
        <AccentColorStyleInjector />

        <link
          rel="shortcut icon"
          href={themeConfig.config.site.faviconDark}
          type="image/x-icon"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="shortcut icon"
          href={themeConfig.config.site.favicon}
          type="image/x-icon"
          media="(prefers-color-scheme: light)"
        />
      </head>
      <body
        id="dashboard"
        className={`${sansFont.variable} ${serifFont.variable} m-0 h-full bg-gray-50 p-0 font-sans dark:bg-black`}
      >
        <DashboardAppProviders>
          <AggregationProvider
            aggregationData={data}
            appConfig={themeConfig.config}
          />

          <ClientOnly>
            <LayoutHeader />
            <ComposedKBarProvider>
              <MainLayout>{children}</MainLayout>
            </ComposedKBarProvider>
            <FABContainer />
          </ClientOnly>
        </DashboardAppProviders>
        <ToastContainer />
      </body>
    </html>
  )
}
