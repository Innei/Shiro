import { ImageResponse } from 'next/og'
import type { ImageResponseOptions } from 'next/server'

import { apiClient } from '~/lib/request'

export const revalidate = 86400 // 24 hours

export const runtime = 'edge'

const resOptions = {
  width: 1200,
  height: 628,
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

  const {
    seo,
    user: { avatar },
    theme,
  } = aggregateData.$serialized
  const ogAvatar =
    (theme as AppThemeConfig | undefined)?.config.module?.og?.avatar || avatar

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fefefe',
        fontFamily: 'system-ui, sans-serif',
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
            'radial-gradient(ellipse at 15% 25%, rgba(0,0,0,0.004) 0%, transparent 35%), radial-gradient(ellipse at 85% 75%, rgba(0,0,0,0.004) 0%, transparent 35%), radial-gradient(ellipse at 40% 85%, rgba(0,0,0,0.003) 0%, transparent 30%), radial-gradient(ellipse at 75% 15%, rgba(0,0,0,0.003) 0%, transparent 30%)',
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
            'radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.025) 100%)',
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

      {/* Main Content - Centered */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
        }}
      >
        {/* Avatar */}
        <img
          src={ogAvatar}
          width={120}
          height={120}
          style={{
            borderRadius: '50%',
            border: '3px solid rgba(0,0,0,0.06)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: seo.title.length > 12 ? '56px' : '72px',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#1a1a1a',
          }}
        >
          {seo.title}
        </div>

        {/* Description */}
        {seo.description && (
          <div
            style={{
              fontSize: '26px',
              fontWeight: 400,
              color: '#888',
              letterSpacing: '-0.01em',
              maxWidth: '700px',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            {seo.description}
          </div>
        )}
      </div>
    </div>,
    {
      ...resOptions,
    },
  )
}
