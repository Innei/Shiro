import { compiler } from 'markdown-to-jsx'
import RemoveMarkdown from 'remove-markdown'
import xss from 'xss'
import type { AggregateRoot } from '@mx-space/api-client'

import { InsertRule } from '~/components/ui/markdown/parsers/ins'
import { MarkRule } from '~/components/ui/markdown/parsers/mark'
import { MentionRule } from '~/components/ui/markdown/parsers/mention'
import { SpoilerRule } from '~/components/ui/markdown/parsers/spoiler'
import { escapeXml } from '~/lib/helper.server'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request'

export const revalidate = 60 * 60 // 1 hour

interface RSSProps {
  title: string
  url: string
  author: string
  description: string
  data: {
    created: Date | null
    modified: Date | null
    link: string
    title: string
    text: string
    id: string
  }[]
}

export async function GET() {
  const ReactDOM = (await import('react-dom/server')).default
  const queryClient = getQueryClient()

  const { author, data, url } = await queryClient.fetchQuery({
    queryKey: ['rss'],
    queryFn: async () => {
      const path = apiClient.aggregate.proxy.feed.toString(true)
      return fetch(path).then((res) => res.json() as Promise<RSSProps>)
    },
  })

  const agg = await fetch(apiClient.aggregate.proxy.toString(true)).then(
    (res) => res.json() as Promise<AggregateRoot>,
  )

  const { title, description } = agg.seo
  const { avatar } = agg.user
  const now = new Date()
  const xml = `<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
<channel>
<atom:link href="${xss(url)}/feed" rel="self" type="application/rss+xml"/>
<title>${title}</title>
<link>${xss(url)}</link>
<description>${description}</description>
<language>zh-CN</language>
<copyright>© ${author} </copyright>
<pubDate>${now.toUTCString()}</pubDate>
<generator>Mix Space CMS (https://github.com/mx-space)</generator>
<docs>https://mx-space.js.org</docs>
<image>
    <url>${xss(avatar || '')}</url>
    <title>${title}</title>
    <link>${xss(url)}</link>
</image>
${await Promise.all(
  data.map(async (item) => {
    return `<item>
    <title>${escapeXml(item.title)}</title>
    <link>${xss(item.link)}</link>
    <pubDate>${new Date(item.created!).toUTCString()}</pubDate>
    <description>${escapeXml(
      xss(RemoveMarkdown(item.text).slice(0, 50)),
    )}</description>
    <content:encoded><![CDATA[
      ${`<blockquote>该渲染由 Shiro API 生成，可能存在排版问题，最佳体验请前往：<a href='${xss(
        item.link,
      )}'>${xss(item.link)}</a></blockquote>
${ReactDOM.renderToString(
  <div>
    {compiler(item.text, {
      overrides: {
        LinkCard: () => null,
        Gallery: () => (
          <div style={{ textAlign: 'center' }}>这个内容只能在原文中查看哦~</div>
        ),
      },
      additionalParserRules: {
        spoilder: SpoilerRule,
        mention: MentionRule,

        mark: MarkRule,
        ins: InsertRule,
      },
    })}
  </div>,
)}
      <p style='text-align: right'>
      <a href='${`${xss(item.link)}#comments`}'>看完了？说点什么呢</a>
      </p>`}
    ]]>
    </content:encoded>
  <guid isPermaLink="false">${item.id}</guid>
 </item>
  `
  }),
).then((res) => res.join(''))}
</channel></rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
