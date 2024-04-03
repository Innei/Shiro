import RSS from 'rss'
import type { AggregateRoot } from '@mx-space/api-client'

import { simpleCamelcaseKeys } from '@mx-space/api-client'

import { apiClient } from '~/lib/request'

export const dynamic = 'force-dynamic'
export const revalidate = 86400 // 1 day

export async function GET() {
  const [agg, thinking] = await Promise.all([
    fetch(apiClient.aggregate.proxy.toString(true), {
      next: {
        revalidate: 86400,
      },
    }).then(
      async (res) =>
        simpleCamelcaseKeys(await res.json()) as Promise<AggregateRoot>,
    ),
    apiClient.recently.getList({
      size: 20,
    }),
  ])

  const { title, description } = agg.seo

  const now = new Date()
  const feed = new RSS({
    title: `思考 - ${title}`,
    description,
    site_url: agg.url.webUrl,
    feed_url: `${agg.url.webUrl}/thinking/feed`,
    language: 'zh-CN',
    generator: 'Shiro (https://github.com/Innei/Shiro)',
    pubDate: now.toUTCString(),
  })

  for (const t of thinking.data) {
    feed.item({
      title: new Date(t.created).toLocaleDateString(),
      description:
        `${t.content}\n\n${t.ref?.title ? `引用：${t.ref.title}` : ''}\n\n` +
        ` <p style='text-align: right'>
      <a href='${`${agg.url.webUrl}/thinking/${t.id}`}'>看完了？说点什么呢</a>
      </p>`,
      url: `${agg.url.webUrl}/thinking`,
      guid: t.id,
      date: t.created,
    })
  }

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=60, s-maxage=86400',
      'CDN-Cache-Control': 'max-age=86400',
      'Cloudflare-CDN-Cache-Control': 'max-age=86400',
      'Vercel-CDN-Cache-Control': 'max-age=86400',
    },
  })
}
