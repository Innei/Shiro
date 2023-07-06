import '../styles/index.css'

import { Analytics } from '@vercel/analytics/react'
import { ToastContainer } from 'react-toastify'
import type { AggregateRoot } from '@mx-space/api-client'

import { ClerkProvider } from '@clerk/nextjs'

import PKG from '~/../package.json'
import { appConfig } from '~/app.config'
import { Root } from '~/components/layout/root/Root'
import { TocAutoScroll } from '~/components/widgets/toc/TocAutoScroll'
import { attachUA } from '~/lib/attach-ua'
import { defineMetadata } from '~/lib/define-metadata'
import { sansFont, serifFont } from '~/lib/fonts'
import { getQueryClient } from '~/lib/query-client.server'
import { AggregationProvider } from '~/providers/root/aggregation-data-provider'
import { queries } from '~/queries/definition'

import { Providers } from '../providers/root'
import { Analyze } from './analyze'
import { init } from './init'

const { version } = PKG
init()

let aggregationData: AggregateRoot | null = null
export const generateMetadata = defineMetadata(async (_, getData) => {
  const fetchedData = aggregationData ?? (await getData())
  aggregationData = fetchedData
  const { seo, url, user } = fetchedData

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
        url: appConfig.site.favicon,
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],

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
      images: {
        url: user.avatar,
        username: user.name,
      },
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
  attachUA()
  const { children } = props

  const queryClient = getQueryClient()

  const data = await queryClient.fetchQuery({
    ...queries.aggregation.root(),
  })

  aggregationData = data

  return (
    // <ClerkProvider localization={ClerkZhCN}>
    <ClerkProvider>
      <html lang="zh-CN" className="noise" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `var version = "${version}";
              ${function info() {
                console.log(
                  `%c Mix Space %c https://github.com/mx-space `,
                  'color: #fff; margin: 1em 0; padding: 5px 0; background: #2980b9;',
                  'margin: 1em 0; padding: 5px 0; background: #efefef;',
                )
                console.log(
                  `%c Shiro ${version} %c https://innei.ren `,
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
              }.toString()}; info()`,
            }}
          />
        </head>
        <body
          className={`${sansFont.variable} ${serifFont.variable} m-0 h-full p-0 font-sans`}
        >
          <Providers>
            <AggregationProvider aggregationData={data} />

            <Root>{children}</Root>

            <TocAutoScroll />
            <Analyze />
          </Providers>
          <ToastContainer />
        </body>
      </html>
      <Analytics />
    </ClerkProvider>
  )
}
