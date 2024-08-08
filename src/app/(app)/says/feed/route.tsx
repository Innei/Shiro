import type { AggregateRoot } from '@mx-space/api-client'
import { simpleCamelcaseKeys } from '@mx-space/api-client'
import RSS from 'rss'

import { apiClient } from '~/lib/request'

export const dynamic = 'force-dynamic'
export const revalidate = 86400 // 1 day

export async function GET() {
  const [agg, says] = await Promise.all([
    fetch(apiClient.aggregate.proxy.toString(true), {
      next: {
        revalidate: 86400,
      },
    }).then(
      async (res) =>
        simpleCamelcaseKeys(await res.json()) as Promise<AggregateRoot>,
    ),
    apiClient.say.getAllPaginated(1, 20),
  ])

  const { title, description } = agg.seo

  const now = new Date()
  const feed = new RSS({
    title: `一言 - ${title}`,
    description,
    site_url: agg.url.webUrl,
    feed_url: `${agg.url.webUrl}/says/feed`,
    language: 'zh-CN',
    generator: 'Shiro (https://github.com/Innei/Shiro)',
    pubDate: now.toUTCString(),
  })

  for (const say of says.data) {
    feed.item({
      title: `来源于 ${say.source || say.author} 的一言`,
      description: `${say.text}\n\n —— ${say.source || say.author}`,
      url: `${agg.url.webUrl}/says`,
      author: `${say.source || say.author}`,
      guid: say.id,
      date: say.created,
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
