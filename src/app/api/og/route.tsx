import { ImageResponse } from 'next/server'
import uniqolor from 'uniqolor'
import type { AggregateRoot } from '@mx-space/api-client'
import type { NextRequest } from 'next/server'

import { apiClient } from '~/lib/request'

const fontNormal = fetch(
  'https://github.com/lxgw/LxgwWenKai/releases/download/v1.300/LXGWWenKai-Regular.ttf',
).then((res) => res.arrayBuffer())
export const runtime = 'edge'

export const revalidate = 60 * 60 * 24 // 24 hours
export const GET = async (req: NextRequest) => {
  try {
    const fontData = await fontNormal

    const { searchParams } = req.nextUrl

    const titlePost = searchParams.get('title')
    const subtitlePost = searchParams.get('subtitle') || ''

    const aggregation = await fetch(apiClient.aggregate.proxy.toString(true), {
      next: {
        revalidate: 60 * 60 * 24,
      },
    }).then((res) => res.json() as Promise<AggregateRoot>)

    const {
      user: { avatar },
      seo: { title },
    } = aggregation

    if (!title)
      return new Response(
        'Failed to generate the OG image. Error: The title is required.',
        { status: 400 },
      )

    const bgAccent = uniqolor(titlePost + subtitlePost, {
      saturation: [30, 35],
      lightness: [60, 70],
    }).color

    const bgAccentLight = uniqolor(titlePost + subtitlePost, {
      saturation: [30, 35],
      lightness: [80, 90],
    }).color

    const bgAccentUltraLight = uniqolor(titlePost + subtitlePost, {
      saturation: [30, 35],
      lightness: [95, 96],
    }).color

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',

            background: `linear-gradient(37deg, ${bgAccent} 27.82%, ${bgAccentLight} 79.68%, ${bgAccentUltraLight} 100%)`,

            fontFamily: 'LXGW WenKai Screen R',

            padding: '5rem',
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
              height={120}
              width={120}
            />

            <span
              style={{
                marginLeft: '3rem',
                color: '#ffffff99',
                fontSize: '2rem',
              }}
            >
              <h3>{title}</h3>
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

                fontSize: '4.2rem',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 1,
                lineClamp: 1,
              }}
            >
              {titlePost?.slice(0, 20)}
            </h1>
            <h2
              style={{
                color: 'rgba(230, 230, 230, 0.85)',
                fontSize: '3rem',
              }}
            >
              {subtitlePost}
            </h2>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: 'LXGW WenKai Screen R',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
        ],
      },
    )
  } catch (e: any) {
    return new Response(`Failed to generate the OG image. Error ${e.message}`, {
      status: 500,
    })
  }
}
