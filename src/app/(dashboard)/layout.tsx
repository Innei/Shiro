import { ToastContainer } from 'react-toastify'
import type { PropsWithChildren } from 'react'

import { ClientOnly } from '~/components/common/ClientOnly'
import { HydrationEndDetector } from '~/components/common/HydrationEndDetector'
import { sansFont, serifFont } from '~/lib/fonts'
import { DashboardAppProviders } from '~/providers/root'

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <title>Shiro · Light Dashboard | Powered by Mix Space</title>
        <HydrationEndDetector />
      </head>
      <body
        className={`${sansFont.variable} ${serifFont.variable} m-0 h-full p-0 font-sans`}
      >
        <DashboardAppProviders>
          <ClientOnly>{children}</ClientOnly>
        </DashboardAppProviders>
        <ToastContainer />
      </body>
    </html>
  )
}
