import dynamic from 'next/dynamic'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import React, { useMemo } from 'react'

import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import {
  getTweetId,
  isBilibiliVideoUrl,
  isCodesandboxUrl,
  isGistUrl,
  isGithubCommitUrl,
  isGithubFilePreviewUrl,
  isGithubPrUrl,
  isGithubRepoUrl,
  isGithubUrl,
  isLeetCodeUrl,
  isSelfArticleUrl,
  isTMDBUrl,
  isTweetUrl,
  isYoutubeUrl,
  parseBilibiliVideoUrl,
  parseGithubGistUrl,
  parseGithubPrUrl,
  parseGithubTypedUrl,
} from '~/lib/link-parser'
import { useFeatureEnabled } from '~/providers/root/app-feature-provider'

import { EmbedGithubFile } from '../../../modules/shared/EmbedGithubFile'
import { MLink } from '../../link/MLink'
import { LinkCard, LinkCardSource } from '../../link-card'

const Tweet = dynamic(() => import('~/components/modules/shared/Tweet'), {
  ssr: false,
})

/**
 * 单行链接的渲染
 */
export const BlockLinkRenderer = ({
  href,
  children,
}: PropsWithChildren<{ href: string }>) => {
  const url = useMemo(() => {
    try {
      return new URL(href)
    } catch {
      return null
    }
  }, [href])

  const fallbackElement = useMemo(
    () => (
      <p>
        <MLink href={href}>{children ?? <span>{href}</span>}</MLink>
      </p>
    ),
    [children, href],
  )

  const tmdbEnabled = useFeatureEnabled('tmdb')

  if (!url) {
    return fallbackElement
  }

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

      return <Tweet id={id} />
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
      // https://codesandbox.io/s/framer-motion-layoutroot-prop-forked-p39g96
      // to
      // https://codesandbox.io/embed/framer-motion-layoutroot-prop-forked-p39g96?fontsize=14&hidenavigation=1&theme=dark
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
    case isSelfArticleUrl(url): {
      return (
        <LinkCard
          fallbackUrl={url.toString()}
          source={LinkCardSource.Self}
          id={url.pathname.slice(1)}
        />
      )
    }
    case isTMDBUrl(url): {
      if (tmdbEnabled)
        return (
          <LinkCard
            fallbackUrl={url.toString()}
            source={LinkCardSource.TMDB}
            id={url.pathname.slice(1)}
          />
        )

      return fallbackElement
    }

    case isLeetCodeUrl(url): {
      return (
        <LinkCard
          fallbackUrl={url.toString()}
          source={LinkCardSource.LEETCODE}
          id={url.pathname.split('/')[2]}
        />
      )
    }

    case isBilibiliVideoUrl(url): {
      const { id } = parseBilibiliVideoUrl(url)

      return (
        <div className="w-[640px] max-w-full">
          <FixedRatioContainer>
            <iframe
              src={`//player.bilibili.com/player.html?bvid=${id}`}
              scrolling="no"
              frameBorder="no"
              className="absolute inset-0 size-full rounded-md border-0"
              allowFullScreen
            />
          </FixedRatioContainer>
        </div>
      )
    }
  }
  return fallbackElement
}

const FixedRatioContainer = ({
  children,
  ratio = 58,
}: {
  ratio?: number
  children: React.ReactNode
}) => {
  return (
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
}

const GithubUrlRenderL: FC<{
  url: URL
  href?: string
  fallbackElement: ReactNode
}> = (props) => {
  const { url, href = url.href, fallbackElement } = props

  switch (true) {
    case isGithubRepoUrl(url): {
      const { owner, repo } = parseGithubTypedUrl(url)
      return <LinkCard id={`${owner}/${repo}`} source={LinkCardSource.GHRepo} />
    }
    case isGistUrl(url): {
      const { owner, id } = parseGithubGistUrl(url)
      return (
        <>
          <iframe
            src={`https://gist.github.com/${owner}/${id}.pibb`}
            className="h-[300px] w-full overflow-auto border-0"
          />

          <a
            className="mt-2 flex space-x-2 center"
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
    case isGithubPrUrl(url): {
      const { owner, repo, pr } = parseGithubPrUrl(url)
      return (
        <LinkCard
          fallbackUrl={url.toString()}
          id={`${owner}/${repo}/${pr}`}
          source={LinkCardSource.GHPr}
        />
      )
    }

    case isGithubCommitUrl(url): {
      const { owner, repo, id } = parseGithubTypedUrl(url)
      return (
        <>
          <p>
            <MLink href={href}>{href}</MLink>
          </p>
          <LinkCard
            fallbackUrl={url.toString()}
            id={`${owner}/${repo}/commit/${id}`}
            source={LinkCardSource.GHCommit}
          />
        </>
      )
    }
    case isGithubFilePreviewUrl(url): {
      const { owner, repo, afterTypeString } = parseGithubTypedUrl(url)
      const splitString = afterTypeString.split('/')
      const ref = splitString[0]
      const path = ref ? splitString.slice(1).join('/') : afterTypeString
      return (
        <div className="flex w-full flex-col items-center">
          <EmbedGithubFile
            owner={owner}
            repo={repo}
            path={path}
            refType={ref}
          />
          <div className="mt-4">
            <MLink href={href}>{href}</MLink>
          </div>
        </div>
      )
    }
  }

  return fallbackElement
}
