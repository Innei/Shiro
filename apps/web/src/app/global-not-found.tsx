// @see https://x.com/huozhi/status/1921693249577889878
import type { Metadata } from 'next'
import { PublicEnvScript } from 'next-runtime-env'

import { NotFound404 } from '~/components/common/404'
import { Global } from '~/components/common/Global'
import { WiderContainer } from '~/components/layout/container/Wider'

export default function GlobalNotFound() {
  // return <NotFound404 />
  return (
    <html lang="zh-CN" className="noise themed" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
        <Global />
      </head>
      <body suppressHydrationWarning>
        <WiderContainer>
          <NotFound404 />
        </WiderContainer>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: "This planet doesn't have knowledge yet, go explore other places.",
  robots: {
    index: false,
  },
}
