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

import { FABContainer } from '~/components/ui/fab'

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
      </head>
      <body
        id="dashboard"
        className={`${sansFont.variable} ${serifFont.variable} m-0 h-full p-0 font-sans`}
      >
        <div className="fixed inset-0 bg-gray-50 dark:bg-black" />
        <DashboardAppProviders>
          <AggregationProvider
            aggregationData={data}
            appConfig={themeConfig.config}
          />

          <ClientOnly>
            <LayoutHeader />
            <ComposedKBarProvider>
              <div className="flex min-h-screen flex-col [&>div]:flex [&>div]:flex-grow [&>div]:flex-col">
                <main className="relative z-[1] mt-28 flex min-h-0 flex-grow flex-col p-4">
                  {children}
                </main>
              </div>
            </ComposedKBarProvider>
            <FABContainer>
              <></>
            </FABContainer>
          </ClientOnly>
        </DashboardAppProviders>
        <ToastContainer />
      </body>
    </html>
  )
}
