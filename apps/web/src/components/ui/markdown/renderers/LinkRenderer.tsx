import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import type * as React from 'react'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { Suspense, useMemo } from 'react'

import { ThinkingItem } from '~/app/[locale]/thinking/item'
import { ClientOnly } from '~/components/common/ClientOnly'
import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { BlockLoading } from '~/components/modules/shared/BlockLoading'
import {
  getTweetId,
  isBilibiliVideoUrl,
  isCodesandboxUrl,
  isGistUrl,
  isGithubFilePreviewUrl,
  isGithubUrl,
  isSelfThinkingUrl,
  isTweetUrl,
  isYoutubeUrl,
  parseBilibiliVideoUrl,
  parseGithubGistUrl,
  parseGithubTypedUrl,
} from '~/lib/link-parser'
import { apiClient } from '~/lib/request'

import { EmbedGithubFile } from '../../../modules/shared/EmbedGithubFile'
import { MarkdownLink } from '../../link/MarkdownLink'
import { LinkCard, usePluginMatcher } from '../../link-card'

const Tweet = dynamic(() => import('~/components/modules/shared/Tweet'), {
  ssr: false,
})

/**
 * 单行链接的渲染
 */
export const BlockLinkRenderer = ({
  href,
  children,
  fallback,
  accessory,
}: PropsWithChildren<{
  href: string
  fallback?: ReactNode
  accessory?: ReactNode
}>) => {
  const url = useMemo(() => {
    try {
      return new URL(href)
    } catch {
      return null
    }
  }, [href])

  const fallbackElement = useMemo(
    () =>
      fallback ?? (
        <p>
          <MarkdownLink href={href}>
            {children ?? <span>{href}</span>}
          </MarkdownLink>
        </p>
      ),
    [children, fallback, href],
  )

  const { matchUrl } = usePluginMatcher()

  const Inner = useMemo(() => {
    if (!url) return null

    // First, try to match with ShadowLinkCard plugins
    const pluginMatch = matchUrl(url)
    if (pluginMatch) {
      return (
        <LinkCard
          fallbackUrl={pluginMatch.match.fullUrl || url.toString()}
          source={pluginMatch.plugin.name}
          id={pluginMatch.match.id}
        />
      )
    }

    // Handle non-ShadowLinkCard embeds (iframes, tweets, etc.)
    switch (true) {
      case isGithubUrl(url): {
        return (
          <GithubUrlRenderL
            url={url}
            href={href}
            fallbackElement={fallbackElement}
          />
        )
      }

      case isTweetUrl(url): {
        const id = getTweetId(url)
        return (
          <Suspense>
            <Tweet id={id} />
          </Suspense>
        )
      }

      case isYoutubeUrl(url): {
        const id = url.searchParams.get('v')!
        return (
          <FixedRatioContainer>
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              className="absolute inset-0 size-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
            />
          </FixedRatioContainer>
        )
      }

      case isCodesandboxUrl(url): {
        return (
          <FixedRatioContainer>
            <iframe
              className="absolute inset-0 size-full rounded-md border-0"
              src={`https://codesandbox.io/embed/${url.pathname.slice(
                2,
              )}?fontsize=14&hidenavigation=1&theme=dark${url.search}`}
            />
          </FixedRatioContainer>
        )
      }

      case isSelfThinkingUrl(url): {
        const id = url.pathname.split('/').pop()!
        return <ThinkingLinkRenderer id={id} />
      }

      case isBilibiliVideoUrl(url): {
        const { id } = parseBilibiliVideoUrl(url)
        return (
          <div className="w-screen max-w-full">
            <FixedRatioContainer>
              <ClientOnly
                fallback={
                  <BlockLoading className="absolute inset-0 size-full rounded-md">
                    哔哩哔哩视频加载中...
                  </BlockLoading>
                }
              >
                <iframe
                  src={`//player.bilibili.com/player.html?bvid=${id}&autoplay=0`}
                  scrolling="no"
                  frameBorder="no"
                  className="absolute inset-0 size-full rounded-md border-0"
                  allowFullScreen
                />
              </ClientOnly>
            </FixedRatioContainer>
          </div>
        )
      }
    }

    return null
  }, [fallbackElement, href, matchUrl, url])

  if (!url) {
    return fallbackElement
  }

  if (Inner) {
    return (
      <>
        {Inner}
        {accessory}
      </>
    )
  }
  return fallbackElement
}

const ThinkingLinkRenderer: FC<{
  id: string
}> = ({ id }) => {
  const { data } = useQuery({
    queryKey: ['thinking', 'recently', id],
    queryFn: () => apiClient.recently.getById(id),
  })

  if (!data) return null
  return (
    <div className="not-prose font-sans">
      <ThinkingItem item={data} />
    </div>
  )
}

const FixedRatioContainer = ({
  children,
  ratio = 58,
}: {
  ratio?: number
  children: React.ReactNode
}) => (
  <div className="my-2">
    <div className="flex justify-center px-4">
      <div
        className="relative h-0 w-full"
        style={{
          paddingBottom: `${ratio}%`,
        }}
      >
        {children}
      </div>
    </div>
  </div>
)

const GithubUrlRenderL: FC<{
  url: URL
  href?: string
  fallbackElement: ReactNode
}> = (props) => {
  const { url, href = url.href, fallbackElement } = props
  const { matchUrl } = usePluginMatcher()

  // Try plugin matching first for GitHub-specific cards
  const pluginMatch = matchUrl(url)
  if (pluginMatch) {
    // Handle commit links specially - show link text above card
    if (pluginMatch.plugin.name === 'gh-commit') {
      return (
        <>
          <p>
            <MarkdownLink href={href}>{href}</MarkdownLink>
          </p>
          <LinkCard
            fallbackUrl={pluginMatch.match.fullUrl || url.toString()}
            id={pluginMatch.match.id}
            source={pluginMatch.plugin.name}
          />
        </>
      )
    }

    return (
      <LinkCard
        fallbackUrl={pluginMatch.match.fullUrl || url.toString()}
        id={pluginMatch.match.id}
        source={pluginMatch.plugin.name}
      />
    )
  }

  // Handle non-card GitHub embeds
  switch (true) {
    case isGistUrl(url): {
      const { owner, id } = parseGithubGistUrl(url)
      return (
        <>
          <iframe
            src={`https://gist.github.com/${owner}/${id}.pibb`}
            className="h-[300px] w-full overflow-auto border-0"
          />
          <a
            className="center mt-2 flex space-x-2"
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            <GitHubBrandIcon />
            <span>{href}</span>
          </a>
        </>
      )
    }

    case isGithubFilePreviewUrl(url): {
      const { owner, repo, afterTypeString } = parseGithubTypedUrl(url)
      const splitString = afterTypeString.split('/')
      const ref = splitString[0]
      const path = ref ? splitString.slice(1).join('/') : afterTypeString
      const matchResult = url.hash.match(/L\d+/g)
      let startLineNumber = 0
      let endLineNumber
      if (!matchResult) {
        startLineNumber = 0
        endLineNumber = undefined
      } else if (matchResult.length === 1) {
        startLineNumber = Number.parseInt(matchResult[0].slice(1)) - 1
        endLineNumber = startLineNumber + 1
      } else {
        startLineNumber = Number.parseInt(matchResult[0].slice(1)) - 1
        endLineNumber = Number.parseInt(matchResult[1].slice(1))
      }
      return (
        <div className="flex w-full flex-col items-center">
          <EmbedGithubFile
            owner={owner}
            repo={repo}
            path={path}
            startLineNumber={startLineNumber}
            endLineNumber={endLineNumber}
            refType={ref}
          />
          <div className="mt-4">
            <MarkdownLink href={href}>{href}</MarkdownLink>
          </div>
        </div>
      )
    }
  }

  return fallbackElement
}
