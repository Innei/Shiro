import '../styles/index.css'

import { dehydrate } from '@tanstack/react-query'

import { ClerkProvider } from '@clerk/nextjs'

import { Root } from '~/components/layout/root/Root'
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
      // TODO dehydrate by route, pass header to filter
      return true
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
        </body>
      </html>
    </ClerkProvider>
  )
}
