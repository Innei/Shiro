import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { Image } from '@mx-space/api-client'
import {
  AggregateController,
  createClient,
  NoteController,
  PageController,
  PostController,
} from '@mx-space/api-client'
import { fetchAdaptor } from '@mx-space/api-client/dist/adaptors/fetch'
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

import { API_URL } from '~/constants/env'
import { defaultLocale } from '~/i18n/config'
import zhMessages from '~/messages/zh/common.json'

const messagesMap = {
  en: () => import('~/messages/en/common.json').then((m) => m.default),
  ja: () => import('~/messages/ja/common.json').then((m) => m.default),
} as const

const apiClient = createClient(fetchAdaptor)(API_URL, {
  controllers: [
    PostController,
    NoteController,
    PageController,
    AggregateController,
  ],
})

export const runtime = 'nodejs'

export const revalidate = 86400

const fontSearchDirs = [
  // Linux (most common paths)
  '/usr/share/fonts/truetype',
  '/usr/share/fonts/opentype',
  '/usr/local/share/fonts',
  '/usr/share/fonts',
  // Linux distro/Docker variants
  '/usr/share/fonts/truetype/lxgw-wenkai',
  '/usr/share/fonts/truetype/lxgw',
  '/usr/share/fonts/truetype/chinese',
  // macOS common paths (local dev)
  '/Library/Fonts',
  process.env.HOME ? join(process.env.HOME, 'Library/Fonts') : '',
].filter(Boolean)

const isVercel = process.env.VERCEL === '1'

async function loadFont(
  fileNames: string[],
  fallbackUrl?: string,
): Promise<ArrayBuffer | null> {
  for (const fileName of fileNames) {
    for (const dir of fontSearchDirs) {
      try {
        const font = await readFile(join(dir, fileName))
        // @ts-expect-error
        return font
      } catch {
        continue
      }
    }
  }

  if (!isVercel && fallbackUrl) {
    try {
      return await fetch(fallbackUrl).then((res) => res.arrayBuffer())
    } catch {
      return null
    }
  }

  return null
}

const cjkRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u

const isLatinOnly = (value?: string) => {
  if (!value) return true
  return !cjkRegex.test(value)
}

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) => {
  try {
    const { locale } = await params
    const { searchParams } = req.nextUrl
    const dataString = searchParams.get('data') as string

    let data:
      | { type: 'post'; category: string; slug: string }
      | { type: 'note'; nid: number }
      | {
          type: 'page'
          slug: string
        }

    const aggregation =
      await apiClient.aggregate.getAggregateData<AppThemeConfig>('shiro')

    try {
      data = JSON.parse(decodeURIComponent(dataString))
    } catch {
      return new Response('Failed to parse the data.', { status: 400 })
    }

    const messages =
      locale &&
      locale !== defaultLocale &&
      messagesMap[locale as keyof typeof messagesMap]
        ? await messagesMap[locale as keyof typeof messagesMap]()
        : zhMessages

    let document: {
      title: string
      subtitle: string
      meta: any
      images: Image[] | undefined
      id: string
    }

    switch (data.type) {
      case 'post': {
        const { category, slug } = data
        document = await apiClient.post
          .getPost(category, slug, { lang: locale })
          .then((r) => ({
            title: r.title,
            subtitle: r.category.name,
            meta: r.meta,
            images: r.images,
            id: r.id,
          }))
        break
      }

      case 'note': {
        const { nid } = data
        document = await apiClient.note
          .getNoteByNid(+nid, { lang: locale })
          .then((r) => ({
            title: r.data.title,
            subtitle: messages.nav_notes,
            meta: r.data.meta,
            images: r.data.images,
            id: r.data.id,
          }))
        break
      }
      case 'page': {
        const { slug } = data
        document = await apiClient.page.getBySlug(slug).then((data) => ({
          title: data.title,
          subtitle: data.subtitle || '',
          meta: data.meta,
          images: data.images,
          id: data.id,
        }))
        break
      }
    }

    const { subtitle, title } = document
    const useGeist = isLatinOnly(title) && isLatinOnly(subtitle)
    const fontFamily = isVercel
      ? 'system-ui, sans-serif'
      : useGeist
        ? 'Geist, system-ui, sans-serif'
        : '"LXGW WenKai", system-ui, sans-serif'

    const [fontData, fontDataBold] = useGeist
      ? await Promise.all([
          loadFont(['Geist-Regular.ttf']),
          loadFont([
            'Geist-SemiBold.ttf',
            'Geist-Medium.ttf',
            'Geist-Bold.ttf',
          ]),
        ])
      : await Promise.all([
          loadFont(['LXGWWenKai-Regular.ttf']),
          loadFont(['LXGWWenKai-Medium.ttf']),
        ])

    const {
      user: { avatar },
      seo,
      theme,
    } = aggregation
    const ogAvatar = theme?.config.module?.og?.avatar || avatar

    if (!title) {
      return new Response(
        'Failed to generate the OG image. Error: The title is required.',
        { status: 400 },
      )
    }

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#fefefe',

          padding: '60px 80px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Paper Texture - Multiple gradient layers to simulate grain */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(ellipse at 20% 30%, rgba(0,0,0,0.008) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.008) 0%, transparent 50%), radial-gradient(ellipse at 40% 80%, rgba(0,0,0,0.006) 0%, transparent 40%), radial-gradient(ellipse at 70% 20%, rgba(0,0,0,0.006) 0%, transparent 40%)',
          }}
        />

        {/* Vignette / Paper Shadow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 50% 50%, transparent 70%, rgba(0,0,0,0.02) 100%)',
          }}
        />

        {/* Bottom Gradient */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '180px',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 40%, transparent 100%)',
          }}
        />

        {/* Header - Site Info */}
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={ogAvatar}
            width={36}
            height={36}
            style={{
              borderRadius: '50%',
              marginRight: '14px',
            }}
          />
          <span
            style={{
              fontSize: '22px',
              fontWeight: 500,
              color: '#555',
              letterSpacing: '-0.01em',
            }}
          >
            {seo.title}
          </span>
        </div>

        {/* Main Content - Vertically Centered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            maxWidth: '1000px',
            fontFamily,
          }}
        >
          <div
            style={{
              fontSize: title.length > 30 ? '60px' : '72px',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#1a1a1a',
              marginBottom: '20px',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: '28px',
                fontWeight: 400,
                color: '#888',
                letterSpacing: '-0.01em',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          fontData && {
            name: useGeist ? 'Geist' : 'LXGW WenKai',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
          fontDataBold && {
            name: useGeist ? 'Geist' : 'LXGW WenKai',
            data: fontDataBold,
            weight: 600,
            style: 'normal',
          },
        ].filter(Boolean) as any[],
        headers: {
          'Cache-Control':
            'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
        },
      },
    )
  } catch (e: any) {
    return new Response(`Failed to generate the OG image. Error ${e.message}`, {
      status: 500,
    })
  }
}
