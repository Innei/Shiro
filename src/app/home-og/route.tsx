import { ImageResponse } from 'next/og'
import type { ImageResponseOptions } from 'next/server'

import { getBackgroundGradient } from '~/lib/helper.server'
import { apiClient } from '~/lib/request'

export const revalidate = 86400 // 24 hours

export const runtime = 'edge'

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
export const GET = async () => {
  const aggregateData = await apiClient.aggregate.getAggregateData()
  const seed = Math.random().toString(36).substring(7)
  const [bgAccent, bgAccentLight, bgAccentUltraLight] =
    getBackgroundGradient(seed)

  const {
    seo,
    user: { avatar },
  } = aggregateData.$serialized
  return new ImageResponse(
    (
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

        <p
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3
            style={{
              color: '#ffffff99',
              fontSize: '3.5rem',
            }}
          >
            {seo.title}
          </h3>
          <p
            style={{
              fontSize: '1.8rem',

              color: '#ffffff89',
            }}
          >
            {seo.description}
          </p>
        </p>
      </div>
    ),
    {
      ...resOptions,
    },
  )
}
