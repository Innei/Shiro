import {
  blockRegex,
  compiler,
  parseCaptureInline,
  Priority,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import RemoveMarkdown from 'remove-markdown'
import xss from 'xss'
import type { AggregateRoot } from '@mx-space/api-client'
import type { MarkdownToJSX } from 'markdown-to-jsx'

import { CDN_HOST } from '~/app.static.config'
import { InsertRule } from '~/components/ui/markdown/parsers/ins'
import { MarkRule } from '~/components/ui/markdown/parsers/mark'
import { MentionRule } from '~/components/ui/markdown/parsers/mention'
import { SpoilerRule } from '~/components/ui/markdown/parsers/spoiler'
import { escapeXml } from '~/lib/helper.server'
import { getQueryClient } from '~/lib/query-client.server'
import { apiClient } from '~/lib/request'

export const dynamic = 'force-dynamic'
export const revalidate = 60 * 10 // 10 min

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
<atom:link href="${xss(
    escapeXml(url),
  )}/feed" rel="self" type="application/rss+xml"/>
<title>${title}</title>
<link>${xss(escapeXml(url))}</link>
<description>${escapeXml(description)}</description>
<language>zh-CN</language>
<copyright>© ${escapeXml(author)} </copyright>
<pubDate>${now.toUTCString()}</pubDate>
<generator>Mix Space CMS (https://github.com/mx-space)</generator>
<docs>https://mx-space.js.org</docs>
<image>
    <url>${xss(escapeXml(avatar) || '')}</url>
    <title>${escapeXml(title)}</title>
    <link>${xss(escapeXml(url))}</link>
</image>
${await Promise.all(
  data.map(async (item) => {
    return `<item>
    <title>${escapeXml(item.title)}</title>
    <link>${escapeXml(xss(item.link))}</link>
    <pubDate>${new Date(item.created!).toUTCString()}</pubDate>
    <description>${escapeXml(
      xss(RemoveMarkdown(item.text).slice(0, 50)),
    )}</description>
    <content:encoded><![CDATA[
      ${`<blockquote>该渲染由 Shiro API 生成，可能存在排版问题，最佳体验请前往：<a href='${xss(
        item.link,
      )}'>${escapeXml(xss(item.link))}</a></blockquote>
${ReactDOM.renderToString(
  <div>
    {compiler(item.text, {
      overrides: {
        LinkCard: () => null,
        Gallery: () => (
          <div style={{ textAlign: 'center' }}>这个内容只能在原文中查看哦~</div>
        ),

        img: ({ src, alt }) => {
          if (src) {
            if (new URL(src).hostname === CDN_HOST) {
              return <span>此图片不支持在 RSS Render 中查看。</span>
            }
          }
          return <img src={src} alt={alt} />
        },
      },
      extendsRules: {
        codeBlock: {
          react(node, output, state) {
            if (node.lang === 'mermaid' || node.lang === 'excalidraw') {
              return <NotSupportRender />
            }
            return (
              <pre key={state.key}>
                <code className={node.lang ? `lang-${node.lang}` : ''}>
                  {node.content}
                </code>
              </pre>
            )
          },
        },
      },
      additionalParserRules: {
        spoilder: SpoilerRule,
        mention: MentionRule,

        mark: MarkRule,
        ins: InsertRule,

        kateX: KateXRule,
        kateXBlock: KateXBlockRule,
        container: ContainerRule,
        alerts: AlertsRule,
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

const NotSupportRender = () => (
  <blockquote
    style={{
      textAlign: 'center',
      margin: '1rem 0',
      backgroundColor: '#f5f5f5',
      borderRadius: '0.5rem',
    }}
  >
    <em>这个内容只能在原文中查看哦</em>
  </blockquote>
)

const ALERT_BLOCKQUOTE_R =
  /^(> \[!(?<type>NOTE|IMPORTANT|WARNING)\].*?)(?<body>(?:\n *>.*?)*)(?=\n{2,}|$)/

const KateXRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(
    /^\$\s{0,}((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)\s{0,}\$/,
  ),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, _, state?) {
    return <NotSupportRender key={state?.key} />
  },
}
const KateXBlockRule: MarkdownToJSX.Rule = {
  match: blockRegex(
    new RegExp(`^\\s*\\$\\$ *(?<content>[\\s\\S]+?)\\s*\\$\\$ *(?:\n *)+\n?`),
  ),

  order: Priority.LOW,
  parse(capture) {
    return {
      type: 'kateXBlock',
      groups: capture.groups,
    }
  },
  react(node, _, state?) {
    return <NotSupportRender key={state?.key} />
  },
}

const AlertsRule: MarkdownToJSX.Rule = {
  match: blockRegex(ALERT_BLOCKQUOTE_R),
  order: Priority.HIGH,
  parse(capture) {
    return {
      raw: capture[0],
      parsed: {
        ...capture.groups,
      },
    }
  },
  react(node, output, state) {
    return <NotSupportRender key={state?.key} />
  },
}

const shouldCatchContainerName = [
  'gallery',
  'banner',
  'carousel',

  'warn',
  'error',
  'danger',
  'info',
  'success',
  'warning',
  'note',
].join('|')

const ContainerRule: MarkdownToJSX.Rule = {
  match: blockRegex(
    new RegExp(
      `^\\s*::: *(?<name>(${shouldCatchContainerName})) *({(?<params>(.*?))})? *\n(?<content>[\\s\\S]+?)\\s*::: *(?:\n *)+\n?`,
    ),
  ),
  order: Priority.MED,
  parse(capture) {
    const { groups } = capture
    return {
      ...groups,
    }
  },
  // @ts-ignore
  react(node, _, state) {
    return <NotSupportRender key={state?.key} />
  },
}
