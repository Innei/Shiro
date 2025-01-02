import type { Image } from '@mx-space/api-client'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { compiler } from 'markdown-to-jsx'
import RSS from 'rss'
import xss from 'xss'

import { CDN_HOST } from '~/app.static.config'
import { AlertsRule as __AlertsRule } from '~/components/ui/markdown/parsers/alert'
import { ContainerRule as __ContainerRule } from '~/components/ui/markdown/parsers/container'
import { InsertRule } from '~/components/ui/markdown/parsers/ins'
import { MarkRule } from '~/components/ui/markdown/parsers/mark'
import { MentionRule } from '~/components/ui/markdown/parsers/mention'
import { SpoilerRule } from '~/components/ui/markdown/parsers/spoiler'
import { get } from '~/lib/lodash'
import { apiClient } from '~/lib/request'

export const dynamic = 'force-dynamic'
export const revalidate = 60

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
    images: Image[]
  }[]
}

export async function GET() {
  const ReactDOM = (await import('react-dom/server')).default

  const [{ author, data, url }, agg] = await Promise.all([
    apiClient.aggregate.proxy.feed.get<RSSProps>(),
    apiClient.aggregate.getAggregateData<AppThemeConfig>('shiro'),
  ])

  const { title, description } = agg.seo

  const now = new Date()
  const custom_elements = get(
    agg.$raw.theme as AppConfig,
    'config.module.rss.custom_elements',
  )

  const followChallengeIndex = custom_elements
    ? custom_elements.findIndex((item: any) => item.follow_challenge)
    : -1
  if (-~followChallengeIndex) {
    const map = {} as Record<string, string>

    const { follow_challenge } = custom_elements[followChallengeIndex]
    for (const item of follow_challenge) {
      Object.assign(map, item)
    }

    custom_elements[followChallengeIndex].follow_challenge = [
      {
        feedId: map.feed_id,
      },
      {
        userId: map.user_id,
      },
    ]
  }

  const feed = new RSS({
    title,
    description,
    site_url: url,
    feed_url: `${url}/feed`,
    language: 'zh-CN',
    image_url: `${url}${agg?.theme?.config?.site?.favicon}`,
    generator: 'Shiro (https://github.com/Innei/Shiro)',
    pubDate: now.toUTCString(),

    custom_elements,
  })

  data.forEach((item) => {
    const render = () => {
      try {
        return ReactDOM.renderToString(
          <div>
            <blockquote>
              该渲染由 Shiro API 生成，可能存在排版问题，最佳体验请前往：
              <a href={`${xss(item.link)}`}>{xss(item.link)}</a>
            </blockquote>
            {compiler(item.text, {
              overrides: {
                LinkCard: NotSupportRender,
                Gallery: NotSupportRender,
                Tabs: NotSupportRender,
                Tab: NotSupportRender,

                img: ({ src, alt, height, width }) => {
                  if (src && new URL(src).hostname === CDN_HOST) {
                    return <span>此图片不支持在 RSS Render 中查看。</span>
                  }

                  const meta = item.images?.find((image) => image.src === src)

                  return (
                    <img
                      src={src}
                      alt={alt}
                      height={height || meta?.height}
                      width={width || meta?.width}
                    />
                  )
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
                      <pre
                        key={state.key}
                        className={
                          node.lang
                            ? `language-${node.lang} lang-${node.lang}`
                            : ''
                        }
                      >
                        <code
                          className={
                            node.lang
                              ? `language-${node.lang} lang-${node.lang}`
                              : ''
                          }
                        >
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

                // kateX: KateXRule,
                // kateXBlock: KateXBlockRule,
                container: ContainerRule,
                alerts: AlertsRule,
              },
            })}
            <p
              style={{
                textAlign: 'right',
              }}
            >
              <a href={`${`${xss(item.link)}#comments`}`}>看完了？说点什么呢</a>
            </p>
          </div>,
        )
      } catch {
        return ReactDOM.renderToString(
          <p>
            当前内容无法在 RSS 阅读器中正确渲染，请前往：
            <a href={`${xss(item.link)}`}>{xss(item.link)}</a>
          </p>,
        )
      }
    }
    feed.item({
      author,
      title: item.title,
      url: item.link,
      date: item.created!,
      description: render(),
    })
  })

  return new Response(`${feed.xml()}`, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `max-age=60, s-maxage=${revalidate}`,
      'CDN-Cache-Control': `max-age=${revalidate}`,
      'Cloudflare-CDN-Cache-Control': `max-age=${revalidate}`,
      'Vercel-CDN-Cache-Control': `max-age=${revalidate}`,
    },
  })
}

const NotSupportRender = () => {
  // throw new Error('Not support render in RSS')
  return (
    <p
      style={{
        padding: '6px 12px',
        borderLeft: '2px solid #33A6B8',
        background: '#33A6B850',
        fontStyle: 'italic',
        fontWeight: 500,
      }}
    >
      Not support render this content in RSS render
    </p>
  )
}

// const KateXRule: MarkdownToJSX.Rule = {
//   ...__KateXRule,
//   react(node, _, state?) {
//     return node
//   },
// }
// const KateXBlockRule: MarkdownToJSX.Rule = {
//   ...__KateXBlockRule,
//   react(node, _, state?) {
//     return <NotSupportRender key={state?.key} />
//   },
// }

const AlertsRule: MarkdownToJSX.Rule = {
  ...__AlertsRule,
  react(node, output, state) {
    const { body } = node.parsed
    const bodyClean = body.replaceAll(/^> */gm, '').trim()

    return <blockquote key={state.key}>{compiler(bodyClean)}</blockquote>
  },
}

const ContainerRule: MarkdownToJSX.Rule = {
  ...__ContainerRule,
  // @ts-ignore
  react(node, _, state) {
    return <NotSupportRender key={state?.key} />
  },
}
