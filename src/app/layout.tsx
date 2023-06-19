import '../styles/index.css'

import { dehydrate } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { ToastContainer } from 'react-toastify'
import { headers } from 'next/dist/client/components/headers'

import { ClerkProvider } from '@clerk/nextjs'

import { Root } from '~/components/layout/root/Root'
import { REQUEST_PATHNAME } from '~/constants/system'
import { defineMetadata } from '~/lib/define-metadata'
import { sansFont, serifFont } from '~/lib/fonts'
import { getQueryClient } from '~/utils/query-client.server'

import { Providers } from '../providers/root'
import { Hydrate } from './hydrate'
import { init } from './init'

init()

export const generateMetadata = defineMetadata(async (_, getData) => {
  const { seo, url, user } = await getData()

  return {
    metadataBase: new URL(url.webUrl),
    title: {
      template: `%s | ${seo.title}`,
      default: `${seo.title} - ${seo.description}`,
    },
    description: seo.description,
    keywords: seo.keywords?.join(',') || '',
    themeColor: [
      { media: '(prefers-color-scheme: dark)', color: '#000212' },
      { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    ],

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: {
        default: seo.title,
        template: `%s | ${seo.title}`,
      },
      description: seo.description,
      siteName: `${seo.title}`,
      locale: 'zh_CN',
      type: 'website',
      url: url.webUrl,
    },
    twitter: {
      creator: `@${user.username}`,
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  }
})

type Props = {
  children: React.ReactNode
}

export default async function RootLayout(props: Props) {
  const { children } = props

  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient, {
    shouldDehydrateQuery: (query) => {
      if (query.state.error) return false
      if (!query.meta) return true
      const {
        shouldHydration,
        hydrationRoutePath,
        skipHydration,
        forceHydration,
      } = query.meta

      if (forceHydration) return true
      if (hydrationRoutePath) {
        const pathname = headers().get(REQUEST_PATHNAME)

        if (pathname === query.meta?.hydrationRoutePath) {
          if (!shouldHydration) return true
          return (shouldHydration as Function)(query.state.data as any)
        }
      }

      if (skipHydration) return false

      return (shouldHydration as Function)?.(query.state.data as any) ?? false
    },
  })

  return (
    // <ClerkProvider localization={ClerkZhCN}>
    <ClerkProvider>
      <html lang="zh-CN" className="noise" suppressHydrationWarning>
        <body
          className={`${sansFont.variable} ${serifFont.variable} m-0 h-full p-0 font-sans antialiased`}
        >
          <Providers>
            <Hydrate state={dehydratedState}>
              <Root>{children}</Root>
            </Hydrate>
          </Providers>
          <ToastContainer />
        </body>
      </html>
      <Analytics />
    </ClerkProvider>
  )
}
