/* eslint-disable no-console */
import { cache } from 'react'
import { ToastContainer } from 'react-toastify'
import type { Metadata, Viewport } from 'next'
import type { PropsWithChildren } from 'react'

import { ClerkProvider } from '@clerk/nextjs'

import PKG from '~/../package.json'
import { Global } from '~/components/common/Global'
import { HydrationEndDetector } from '~/components/common/HydrationEndDetector'
import { ScrollTop } from '~/components/common/ScrollTop'
import { Root } from '~/components/layout/root/Root'
import { AccentColorStyleInjector } from '~/components/modules/shared/AccentColorStyleInjector'
import { SearchPanelWithHotKey } from '~/components/modules/shared/SearchFAB'
import { TocAutoScroll } from '~/components/modules/toc/TocAutoScroll'
import { attachUAAndRealIp } from '~/lib/attach-ua'
import { sansFont, serifFont } from '~/lib/fonts'
import { getQueryClient } from '~/lib/query-client.server'
import { AggregationProvider } from '~/providers/root/aggregation-data-provider'
import { AppFeatureProvider } from '~/providers/root/app-feature-provider'
import { queries } from '~/queries/definition'

import { WebAppProviders } from '../../providers/root'
import { Analyze } from './analyze'

const { version } = PKG

export const revalidate = 3600 // 3600s

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

const fetchAggregationData = cache(async () => {
  const queryClient = getQueryClient()
  attachUAAndRealIp()

  return queryClient.fetchQuery(queries.aggregation.root())
})
export const generateMetadata = async (): Promise<Metadata> => {
  const fetchedData = await fetchAggregationData()

  const {
    seo,
    url,
    user,
    theme: { config },
  } = fetchedData

  return {
    metadataBase: new URL(url.webUrl),
    title: {
      template: `%s - ${seo.title}`,
      default: `${seo.title} - ${seo.description}`,
    },
    description: seo.description,
    keywords: seo.keywords?.join(',') || '',
    icons: [
      {
        url: config.site.favicon,
        type: 'image/svg+xml',
        sizes: 'any',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: config.site.favicon,
        media: '(prefers-color-scheme: light)',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: config.site.faviconDark || config.site.favicon,

        media: '(prefers-color-scheme: dark)',
      },
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
      images: {
        url: `${url.webUrl}/og`,
        username: user.name,
      },
    },
    twitter: {
      creator: `@${user.username}`,
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },

    alternates: {
      canonical: url.webUrl,
      types: {
        'application/rss+xml': [{ url: 'feed', title: 'RSS 订阅' }],
      },
    },
  } satisfies Metadata
}

export default async function RootLayout(props: PropsWithChildren) {
  const { children } = props

  const data = await fetchAggregationData()

  const themeConfig = data.theme

  return (
    <ClerkProvider>
      <AppFeatureProvider tmdb={!!process.env.TMDB_API_KEY}>
        <html
          lang="zh-CN"
          className="noise !bg-accent"
          suppressHydrationWarning
        >
          <head>
            <Global />
            <SayHi />
            <HydrationEndDetector />
            <AccentColorStyleInjector color={themeConfig.config.color} />

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
            className={`${sansFont.variable} ${serifFont.variable} m-0 h-full p-0 font-sans`}
          >
            <WebAppProviders>
              <AggregationProvider
                aggregationData={data}
                appConfig={themeConfig.config}
              />

              <div data-theme>
                <Root>{children}</Root>
              </div>

              <TocAutoScroll />
              <SearchPanelWithHotKey />
              <Analyze />
            </WebAppProviders>
            <ToastContainer />
            <ScrollTop />
          </body>
        </html>
      </AppFeatureProvider>
    </ClerkProvider>
  )
}

const SayHi = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `var version = "${version}";
    (${function () {
      console.log(
        `%c Mix Space %c https://github.com/mx-space `,
        'color: #fff; margin: 1em 0; padding: 5px 0; background: #2980b9;',
        'margin: 1em 0; padding: 5px 0; background: #efefef;',
      )
      console.log(
        `%c Shiro ${window.version} %c https://innei.in `,
        'color: #fff; margin: 1em 0; padding: 5px 0; background: #39C5BB;',
        'margin: 1em 0; padding: 5px 0; background: #efefef;',
      )

      const motto = `
This Personal Space Powered By Mix Space.
Written by TypeScript, Coding with Love.
--------
Stay hungry. Stay foolish. --Steve Jobs
`

      if (document.firstChild?.nodeType !== Node.COMMENT_NODE) {
        document.prepend(document.createComment(motto))
      }
    }.toString()})();`,
      }}
    />
  )
}

declare global {
  interface Window {
    version: string
  }
}
