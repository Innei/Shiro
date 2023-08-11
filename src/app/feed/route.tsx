import { compiler } from 'markdown-to-jsx'
import xss from 'xss'
import type { AggregateRoot } from '@mx-space/api-client'

import { InsertRule } from '~/components/ui/markdown/parsers/ins'
import { MarkRule } from '~/components/ui/markdown/parsers/mark'
import { MentionRule } from '~/components/ui/markdown/parsers/mention'
import { SpoilerRule } from '~/components/ui/markdown/parsers/spoiler'
import { escapeXml } from '~/lib/helper.server'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request'

export const runtime = 'edge'
export const revalidate = 60 * 60 // 1 hour

export async function GET() {
  const ReactDOM = (await import('react-dom/server')).default
  const queryClient = getQueryClient()

  const { author, data, url } = await queryClient.fetchQuery({
    queryKey: ['rss'],
    queryFn: async () => {
      const path = apiClient.aggregate.proxy.feed.toString(true)
      return fetch(path).then((res) => res.json())
    },
  })

  const agg = await fetch(apiClient.aggregate.proxy.toString(true)).then(
    (res) => res.json() as Promise<AggregateRoot>,
  )

  const { title } = agg.seo
  const { avatar } = agg.user
  const now = new Date()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${title}</title>
      <link href="/atom.xml" rel="self"/>
      <link href="/feed" rel="self"/>
      <link href="${xss(url)}"/>
      <updated>${now.toISOString()}</updated>
      <id>${xss(url)}</id>
      <author>
        <name>${author}</name>
      </author>
      <generator>Mix Space CMS</generator>
      <lastBuildDate>${now.toISOString()}</lastBuildDate>
      <language>zh-CN</language>
      <image>
          <url>${xss(avatar || '')}</url>
          <title>${title}</title>
          <link>${xss(url)}</link>
      </image>
        ${await Promise.all(
          data.map(async (item: any) => {
            return `<entry>
            <title>${escapeXml(item.title)}</title>
            <link href='${xss(item.link)}'/>
            <id>${xss(item.link)}</id>
            <published>${item.created}</published>
            <updated>${item.modified}</updated>
            <content type='html'><![CDATA[
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
        // kateX: KateXRule,
        // container: ContainerRule,
      },
    })}
  </div>,
)}
              <p style='text-align: right'>
              <a href='${`${xss(item.link)}#comments`}'>看完了？说点什么呢</a>
              </p>`}
            ]]>
            </content>
            </entry>
          `
          }),
        ).then((res) => res.join(''))}
    </feed>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
