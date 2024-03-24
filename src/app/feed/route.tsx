import {
  blockRegex,
  compiler,
  parseCaptureInline,
  Priority,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import RSS from 'rss'
import xss from 'xss'
import type { AggregateRoot } from '@mx-space/api-client'
import type { MarkdownToJSX } from 'markdown-to-jsx'

import { CDN_HOST } from '~/app.static.config'
import { InsertRule } from '~/components/ui/markdown/parsers/ins'
import { MarkRule } from '~/components/ui/markdown/parsers/mark'
import { MentionRule } from '~/components/ui/markdown/parsers/mention'
import { SpoilerRule } from '~/components/ui/markdown/parsers/spoiler'
import { escapeXml } from '~/lib/helper.server'
import { apiClient } from '~/lib/request'

// export const dynamic = 'force-dynamic'
export const revalidate = 86400 // 1 day

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

  const [{ author, data, url }, agg] = await Promise.all([
    fetch(apiClient.aggregate.proxy.feed.toString(true), {
      next: {
        revalidate: 86400,
      },
    }).then((res) => res.json() as Promise<RSSProps>),
    fetch(apiClient.aggregate.proxy.toString(true), {
      next: {
        revalidate: 86400,
      },
    }).then((res) => res.json() as Promise<AggregateRoot>),
  ])

  const { title, description } = agg.seo

  const now = new Date()
  const feed = new RSS({
    title,
    description,
    site_url: url,
    feed_url: `${url}/feed`,
    language: 'zh-CN',
    image_url: `${url}/og`,
    generator: 'Shiro (https://github.com/Innei/Shiro)',
    pubDate: now.toUTCString(),
  })

  data.forEach((item) => {
    feed.item({
      author,
      title: item.title,
      url: item.link,
      date: item.created!,
      description: `<blockquote>该渲染由 Shiro API 生成，可能存在排版问题，最佳体验请前往：<a href='${xss(
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
        Tabs: NotSupportRender,
        Tab: NotSupportRender,

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
            if (
              node.lang === 'mermaid' ||
              node.lang === 'excalidraw' ||
              node.lang === 'component'
            ) {
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
      </p>`,
    })
  })

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
