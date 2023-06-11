import '../styles/index.css'

import { dehydrate } from '@tanstack/react-query'
import { headers } from 'next/dist/client/components/headers'
import type { Metadata } from 'next'

import { sansFont } from '~/lib/fonts'
import { queries } from '~/queries/definition'
import { getQueryClient } from '~/utils/query-client.server'
import { $axios } from '~/utils/request'

import { Providers } from '../providers/root'
import { Hydrate } from './hydrate'

export const generateMetadata = async (): Promise<Metadata> => {
  const { get } = headers()
  const queryClient = getQueryClient()
  const ua = get('user-agent')
  const { seo, url, user } = await queryClient.fetchQuery({
    ...queries.aggregation.root(),
  })
  $axios.defaults.headers.common['User-Agent'] = ua

  return {
    metadataBase: new URL(url.webUrl),
    title: {
      template: `%s | ${seo.title}`,
      default: seo.title,
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
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient, {
    shouldDehydrateQuery: (query) => {
      if (query.state.error) return false
      // TODO dehydrate by route, pass header to filter
      return true
    },
  })
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${sansFont.variable} m-0 h-full p-0 font-sans antialiased`}
      >
        <Providers>
          <Hydrate state={dehydratedState}>{children}</Hydrate>
        </Providers>
      </body>
    </html>
  )
}
