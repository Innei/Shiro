import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { PublicEnvScript } from 'next-runtime-env'
import { fetch } from 'ofetch'
import type { PropsWithChildren } from 'react'

import PKG from '~/../package.json'
import { DayjsLocaleSync } from '~/components/common/DayjsLocaleSync'
import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { Global } from '~/components/common/Global'
import { HydrationEndDetector } from '~/components/common/HydrationEndDetector'
import { SyncServerTime } from '~/components/common/SyncServerTime'
import { Root } from '~/components/layout/root/Root'
import { AccentColorStyleInjector } from '~/components/modules/shared/AccentColorStyleInjector'
import { SearchPanelWithHotKey } from '~/components/modules/shared/SearchFAB'
import { TocAutoScroll } from '~/components/modules/toc/TocAutoScroll'
import { routing } from '~/i18n/routing'
import { PreRenderError } from '~/lib/error-factory'
import { sansFont, serifFont } from '~/lib/fonts'
import { apiClient } from '~/lib/request'
import { AggregationProvider } from '~/providers/root/aggregation-data-provider'
import { AppFeatureProvider } from '~/providers/root/app-feature-provider'
import { HydrateuserAuthProvider } from '~/providers/root/hydrate-user-auth-provider'
import { ScriptInjectProvider } from '~/providers/root/script-inject-provider'

import { WebAppProviders } from '../../providers/root'
import { fetchAggregationData } from './api'

const { version } = PKG

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

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

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  const fetchedData = await fetchAggregationData()

  const {
    seo,
    url,
    user,
    theme: { config },
  } = fetchedData

  const localeMap: Record<string, string> = {
    zh: 'zh_CN',
    en: 'en_US',
    ja: 'ja_JP',
  }

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
      locale: localeMap[locale] || 'zh_CN',
      type: 'website',
      url: url.webUrl,
      images: {
        url: `${url.webUrl}/home-og`,
        username: user.name,
      },
    },
    twitter: {
      creator: `@${user.socialIds?.twitter || user.socialIds?.x || '__oQuery'}`,
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
export const dynamic = 'force-dynamic'

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  const data = await fetchAggregationData().catch(
    (err) => new PreRenderError(err.message),
  )

  if (data instanceof PreRenderError) {
    return (
      <html lang={locale} className="noise themed" suppressHydrationWarning>
        <head>
          <PublicEnvScript />
          <SayHi />
        </head>
        <body
          suppressHydrationWarning
          className={`${sansFont.variable} ${serifFont.variable} m-0 h-full p-0 font-sans`}
        >
          <NextIntlClientProvider messages={messages}>
            <div className="center flex h-screen">
              初始数据的获取失败，请检查 API
              服务器是否正常运行。接口请求错误信息：
              <br />
              {data.message}
            </div>
          </NextIntlClientProvider>
        </body>
      </html>
    )
  }

  const themeConfig = data.theme

  const headers = new Headers()

  headers.append(
    'cookie',
    (await cookies())
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; '),
  )

  headers.append('user-agent', 'Shiro')

  const userAuth = await fetch(
    apiClient.proxy('owner')('check_logged').toString(true),
    { headers },
  )
    .then((res) => res.json())
    .then((res) => !!res.ok)
    .catch(() => false)

  return (
    <>
      <AppFeatureProvider tmdb={!!process.env.TMDB_API_KEY}>
        <HydrateuserAuthProvider isLogged={userAuth} />
        <html lang={locale} className="noise themed" suppressHydrationWarning>
          <head>
            <PublicEnvScript />
            <Global />
            <SayHi />
            <HydrationEndDetector />
            {themeConfig.config?.color && (
              <AccentColorStyleInjector color={themeConfig.config.color} />
            )}
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
            <ScriptInjectProvider />
          </head>
          <body
            suppressHydrationWarning
            className={`${sansFont.variable} ${serifFont.variable} m-0 h-full p-0 font-sans`}
          >
            <NextIntlClientProvider messages={messages}>
              <DayjsLocaleSync />
              <ErrorBoundary>
                <WebAppProviders>
                  <AggregationProvider
                    aggregationData={data}
                    appConfig={themeConfig.config}
                  />
                  <div id="root" data-theme>
                    <Root>{children}</Root>
                  </div>
                  <TocAutoScroll />
                  <SearchPanelWithHotKey />
                  <SyncServerTime />
                  <div className="fixed inset-y-0 right-0 w-[var(--removed-body-scroll-bar-size)]" />
                </WebAppProviders>
              </ErrorBoundary>
            </NextIntlClientProvider>
          </body>
        </html>
      </AppFeatureProvider>
    </>
  )
}

const SayHi = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `var version = "${version}";
    (${function () {
      console.info(
        `%c Mix Space %c https://github.com/mx-space`,
        'color: #fff; margin: 1em 0; padding: 5px 0; background: #2980b9;',
        'margin: 1em 0; padding: 5px 0; background: #efefef;',
      )
      console.info(
        `%c Shiro ${window.version} %c https://github.com/Innei/Shiro`,
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

declare global {
  interface Window {
    version: string
  }
}
