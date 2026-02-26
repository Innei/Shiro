import RemoveMarkdown from 'remove-markdown'
import uniqolor from 'uniqolor'

import { getWebUrl } from '~/atoms'
import { getDominantColor } from '~/lib/image'
import { apiClient } from '~/lib/request'

import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

export const mxSpacePlugin: LinkCardPlugin = {
  name: 'self',
  displayName: 'MxSpace Article',
  priority: 10, // Low priority - catch internal links last

  matchUrl(url: URL): UrlMatchResult | null {
    // Check if it's a self URL
    const webUrl = getWebUrl()
    const webHost = webUrl ? new URL(webUrl).hostname : ''

    const isSelfHost = webHost === url.hostname

    if (!isSelfHost) return null

    // Check for posts or notes paths
    if (
      !url.pathname.startsWith('/posts/') &&
      !url.pathname.startsWith('/notes/')
    ) {
      return null
    }

    return {
      id: url.pathname.slice(1), // Remove leading slash
      fullUrl: url.toString(),
    }
  },

  isValidId(id: string): boolean {
    const [type, ...rest] = id.split('/')
    if (type !== 'posts' && type !== 'notes') {
      return false
    }
    if (type === 'posts') {
      return rest.length === 2
    }
    return rest.length === 1
  },

  async fetch(id: string): Promise<LinkCardData> {
    const [type, ...rest] = id.split('/')

    let data: {
      title: string
      text?: string
      images?: { src: string }[]
      meta?: Record<string, any> | null
      cover?: string
      summary?: string | null
    } = { title: '', text: '' }

    if (type === 'posts') {
      const [cate, slug] = rest
      data = await apiClient.post.getPost(cate, slug)
    } else if (type === 'notes') {
      const [nid] = rest
      const response = await apiClient.note.getNoteById(+nid)
      data = response.data
    }

    const coverImage = data.cover || data.meta?.cover
    let spotlightColor = ''

    if (coverImage) {
      // Async load dominant color
      const $image = new Image()
      $image.src = coverImage
      $image.crossOrigin = 'Anonymous'
      // Note: In the plugin architecture, we can't update state after initial return
      // The color will be set initially, and dynamic update would require different handling
      try {
        await new Promise<void>((resolve, reject) => {
          $image.onload = () => {
            spotlightColor = getDominantColor($image)
            resolve()
          }
          $image.onerror = reject
          // Timeout fallback
          setTimeout(resolve, 3000)
        })
      } catch {
        // Use fallback color
        spotlightColor = uniqolor(data.title, {
          saturation: [30, 35],
          lightness: [60, 70],
        }).color
      }
    } else {
      spotlightColor = uniqolor(data.title, {
        saturation: [30, 35],
        lightness: [60, 70],
      }).color
    }

    return {
      title: data.title,
      desc:
        data.summary || `${RemoveMarkdown(data.text ?? '').slice(0, 50)}...`,
      image: coverImage || data.images?.[0]?.src,
      color: spotlightColor,
    }
  },
}
