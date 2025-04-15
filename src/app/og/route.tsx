import type { Image } from '@mx-space/api-client'
import {
  AggregateController,
  createClient,
  NoteController,
  PageController,
  PostController,
} from '@mx-space/api-client'
import { fetchAdaptor } from '@mx-space/api-client/dist/adaptors/fetch'
import type { NextRequest } from 'next/server'
import sharp from 'sharp'

import { API_URL } from '~/constants/env'
import {
  getBackgroundGradientByBaseColor,
  getBackgroundGradientBySeed,
} from '~/lib/helper.server' // 24 hours

// const templatePromise = fetch(new URL('og-template.svg', import.meta.url)).then(
//   (res) => res.text(),
// )
import ogTemplate from './og-template.svg'

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
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl

    const svgTemplate = ogTemplate

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

    const ogAvatarBase64 = await fetch(ogAvatar)
      .then((res) => res.arrayBuffer())
      .then((buffer) => Buffer.from(buffer).toString('base64'))

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

    // Title line break based on character width (Western=1, CJK=2)
    const titleLines = []
    const maxWidth = 30
    let currentLine = ''
    let currentWidth = 0

    for (const char of title) {
      // Check if character is CJK (Chinese, Japanese, Korean)
      const isCJK =
        /[\u4e00-\u9fff\u3040-\u30ff\u3400-\u4dbf\uac00-\ud7af]/.test(char)
      const charWidth = isCJK ? 2 : 1

      if (currentWidth + charWidth > maxWidth) {
        titleLines.push(currentLine)
        currentLine = char
        currentWidth = charWidth
      } else {
        currentLine += char
        currentWidth += charWidth
      }
    }

    if (currentLine) {
      titleLines.push(currentLine)
    }

    // Fill the SVG template with actual values
    const filledTemplate = svgTemplate
      .replaceAll('{{ bgAccent }}', bgAccent)
      .replaceAll('{{ bgAccentLight }}', bgAccentLight)
      .replaceAll('{{ bgAccentUltraLight }}', bgAccentUltraLight)
      .replaceAll('{{ avatar }}', ogAvatarBase64)
      .replaceAll('{{ siteName }}', seo.title)
      .replaceAll(
        '{{ title }}',
        titleLines
          .slice(0, 2)
          .map(
            (line, index) => `<text 
      x="0"
      y="${index * 72}" 
      font-family="LXGW WenKai, Noto Sans CJK SC, WenQuanYi Micro Hei"
      font-size="64"
      font-weight="bold"
      fill="rgba(255, 255, 255, 0.98)"
      text-anchor="end"
    >
     ${line}
    </text>`,
          )
          .join(''),
      )
      .replaceAll('{{ subtitle }}', subtitle || '')

    // Generate image using sharp
    const buffer = await sharp(Buffer.from(filledTemplate)).png().toBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control':
          'max-age=3600, s-maxage=3600, stale-while-revalidate=600',
        'CDN-Cache-Control': 'max-age=3600, stale-while-revalidate=600',
      },
    })
  } catch (e: any) {
    return new Response(`Failed to generate the OG image. Error ${e.message}`, {
      status: 500,
    })
  }
}
