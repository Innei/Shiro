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
import type { ImageResponseOptions, NextRequest } from 'next/server'

import { API_URL } from '~/constants/env'
import {
  getBackgroundGradientByBaseColor,
  getBackgroundGradientBySeed,
} from '~/lib/helper.server'

const apiClient = createClient(fetchAdaptor)(API_URL, {
  controllers: [
    PostController,
    NoteController,
    PageController,
    AggregateController,
  ],
})

export const runtime = 'edge'

export const revalidate = 86400 // 24 hours

const resOptions = {
  width: 1200,
  height: 600,
  emoji: 'twemoji',
  headers: new Headers([
    [
      'cache-control',
      'max-age=3600, s-maxage=3600, stale-while-revalidate=600',
    ],
    ['cdn-cache-control', 'max-age=3600, stale-while-revalidate=600'],
  ]),
} as ImageResponseOptions

export const GET = async (req: NextRequest) => {
  try {
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

    let document: {
      title: string
      subtitle: string
      meta: any
      images: Image[] | undefined
    }

    switch (data.type) {
      case 'post': {
        const { category, slug } = data
        document = await apiClient.post.getPost(category, slug).then((r) => ({
          title: r.title,
          subtitle: r.category.name,
          meta: r.meta,
          images: r.images,
        }))
        break
      }

      case 'note': {
        const { nid } = data
        document = await apiClient.note.getNoteById(+nid).then((r) => ({
          title: r.data.title,
          subtitle: '手记',
          meta: r.data.meta,
          images: r.data.images,
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
        }))
        break
      }
    }
    const { subtitle, title } = document

    const {
      user: { avatar },
      seo,
      theme,
    } = aggregation
    const ogAvatar = theme?.config.module?.og?.avatar || avatar

    if (!title)
      return new Response(
        'Failed to generate the OG image. Error: The title is required.',
        { status: 400 },
      )

    const cover = document.meta?.cover
    const coverAccent = document.images?.find((i) => i.src === cover)?.accent
    const [bgAccent, bgAccentLight, bgAccentUltraLight] = coverAccent
      ? getBackgroundGradientByBaseColor(coverAccent)
      : getBackgroundGradientBySeed(title + subtitle)

    // let canShownTitle = ''

    // let leftContainerWidth = 1200 - 80 * 2
    // const cjkWidth = 64
    // for (let i = 0; i < title.length; i++) {
    //   if (leftContainerWidth < 0) break
    //   //  cjk 字符算 64 px
    //   const char = title[i]
    //   // char 不能是 emoji
    //   if ((char >= '\u4e00' && char <= '\u9fa5') || char === ' ') {
    //     leftContainerWidth -= cjkWidth
    //     canShownTitle += char
    //   } else if (char >= '\u0000' && char <= '\u00ff') {
    //     // latin 字符算 40px
    //     leftContainerWidth -= 40
    //     canShownTitle += char
    //   } else {
    //     leftContainerWidth -= cjkWidth
    //     canShownTitle += char
    //   }
    // }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',

            background: `linear-gradient(37deg, ${bgAccent} 27.82%, ${bgAccentLight} 79.68%, ${bgAccentUltraLight} 100%)`,

            // fontFamily: 'LXGWWenKai',
            fontFamily: 'system-ui, Noto Sans, Inter, "Material Icons"',

            padding: '5rem',

            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',

              position: 'absolute',
              right: '5rem',
              bottom: '2rem',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              <h3>{seo.title}</h3>
            </span>
          </div>

          <div
            style={{
              position: 'absolute',
              left: '5rem',
              display: 'flex',
              top: '2rem',
            }}
          >
            <img
              src={ogAvatar}
              style={{
                borderRadius: '50%',
              }}
              height={128}
              width={128}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flexDirection: 'column',
              textAlign: 'right',
              transform: 'translateY(-20px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                height: '180px',
                alignItems: 'flex-end',
              }}
            >
              <h1
                style={{
                  color: 'rgba(255, 255, 255, 0.92)',
                  fontSize: '64px',
                  lineHeight: 2,

                  fontWeight: 'bold',
                }}
              >
                {title}
              </h1>
            </div>
            <h2
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '40px',
                fontWeight: 'lighter',
                transform: 'translateY(-20px)',
              }}
            >
              {subtitle}
            </h2>
          </div>
        </div>
      ),
      resOptions,
    )
  } catch (e: any) {
    return new Response(`Failed to generate the OG image. Error ${e.message}`, {
      status: 500,
    })
  }
}
