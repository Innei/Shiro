import { ImageResponse } from 'next/og'
import uniqolor from 'uniqolor'
import type { AggregateRoot } from '@mx-space/api-client'
import type { ImageResponseOptions, NextRequest } from 'next/server'
import type { FC } from 'react'

import {
  AggregateController,
  createClient,
  NoteController,
  PageController,
  PostController,
} from '@mx-space/api-client'
import { fetchAdaptor } from '@mx-space/api-client/dist/adaptors/fetch'

import { API_URL } from '~/constants/env'

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

const HomeOGImage: FC<AggregateRoot> = ({ seo, user: { avatar } }) => {
  const seed = Math.random().toString(36).substring(7)
  const bgAccent = uniqolor(seed, {
    saturation: [30, 35],
    lightness: [60, 70],
  }).color

  const bgAccentLight = uniqolor(seed, {
    saturation: [30, 35],
    lightness: [80, 90],
  }).color

  const bgAccentUltraLight = uniqolor(seed, {
    saturation: [30, 35],
    lightness: [95, 96],
  }).color

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',

        background: `linear-gradient(37deg, ${bgAccent} 27.82%, ${bgAccentLight} 79.68%, ${bgAccentUltraLight} 100%)`,

        fontFamily: 'Noto Sans, Inter, "Material Icons"',

        padding: '80px 15rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <img
        src={avatar}
        style={{
          borderRadius: '50%',
        }}
        height={256}
        width={256}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '3rem',
          width: '500px',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h3
          style={{
            color: '#ffffff99',
            fontSize: '3.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          {seo.title}
        </h3>
        <p
          style={{
            fontSize: '1.8rem',
            height: '5.2rem',
            overflow: 'hidden',
            lineClamp: 2,
            color: '#ffffff89',
          }}
        >
          {seo.description}
        </p>
      </div>
    </div>
  )
}

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

    const aggregation = await fetch(apiClient.aggregate.proxy.toString(true), {
      next: {
        revalidate: 3600,
      },
    }).then((res) => res.json() as Promise<AggregateRoot>)

    if (!dataString) {
      return new ImageResponse(<HomeOGImage {...aggregation} />, resOptions)
    }

    try {
      data = JSON.parse(decodeURIComponent(dataString))
    } catch {
      return new Response('Failed to parse the data.', { status: 400 })
    }

    let document: { title: string; subtitle: string }

    switch (data.type) {
      case 'post': {
        const { category, slug } = data
        document = await apiClient.post
          .getPost(category, slug)
          .then((r) => ({ title: r.title, subtitle: r.category.name }))
        break
      }

      case 'note': {
        const { nid } = data
        document = await apiClient.note
          .getNoteById(+nid)
          .then((r) => ({ title: r.data.title, subtitle: '手记' }))
        break
      }
      case 'page': {
        const { slug } = data
        document = await apiClient.page.getBySlug(slug).then((data) => ({
          title: data.title,
          subtitle: data.subtitle || '',
        }))
        break
      }
    }
    const { subtitle, title } = document

    const {
      user: { avatar },
      seo,
    } = aggregation

    if (!title)
      return new Response(
        'Failed to generate the OG image. Error: The title is required.',
        { status: 400 },
      )

    const bgAccent = uniqolor(title + subtitle, {
      saturation: [30, 35],
      lightness: [60, 70],
    }).color

    const bgAccentLight = uniqolor(title + subtitle, {
      saturation: [30, 35],
      lightness: [80, 90],
    }).color

    const bgAccentUltraLight = uniqolor(title + subtitle, {
      saturation: [30, 35],
      lightness: [95, 96],
    }).color

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
            fontFamily: 'Inter, Noto Sans, Inter, "Material Icons"',

            padding: '80px',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',

              position: 'absolute',
              left: '5rem',
              top: '5rem',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={avatar}
              style={{
                borderRadius: '50%',
              }}
              height={128}
              width={128}
            />

            <span
              style={{
                marginLeft: '3rem',
                color: '#ffffff99',
                fontSize: '2rem',
              }}
            >
              <h3>{seo.title}</h3>
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flexDirection: 'column',
              textAlign: 'right',
            }}
          >
            <h1
              style={{
                color: 'rgba(255, 255, 255, 0.92)',
                fontSize: '50px',
                overflow: 'hidden',
                maxHeight: '150px',
                fontWeight: 'bold',
              }}
            >
              {title}
            </h1>
            <h2
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '38px',
                fontWeight: 'lighter',
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
