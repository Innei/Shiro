import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'

import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import {
  getTweetId,
  isCodesandboxUrl,
  isGistUrl,
  isGithubCommitUrl,
  isGithubFilePreviewUrl,
  isGithubRepoUrl,
  isSelfArticleUrl,
  isTweetUrl,
  isYoutubeUrl,
  parseGithubGistUrl,
  parseGithubRepoUrl,
  parseGithubTypedUrl,
} from '~/lib/link-parser'

import { EmbedGithubFile } from '../../../widgets/shared/EmbedGithubFile'
import { LinkCard } from '../../link-card'
import { MLink } from '../../link/MLink'

const Tweet = dynamic(() => import('~/components/widgets/shared/Tweet'), {
  ssr: false,
})
export const LinkRenderer = ({
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

  if (!url) {
    return fallbackElement
  }
  switch (true) {
    case isTweetUrl(url): {
      const id = getTweetId(url)

      return <Tweet id={id} />
    }

    case isGithubRepoUrl(url): {
      const { owner, repo } = parseGithubRepoUrl(url)
      return <LinkCard id={`${owner}/${repo}`} source="gh" />
    }

    case isYoutubeUrl(url): {
      const id = url.searchParams.get('v')!
      return (
        <FixedRatioContainer>
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          />
        </FixedRatioContainer>
      )
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

    case isGithubCommitUrl(url): {
      const { owner, repo, id } = parseGithubTypedUrl(url)
      return (
        <>
          <p>
            <MLink href={href}>{href}</MLink>
          </p>
          <LinkCard id={`${owner}/${repo}/commit/${id}`} source="gh-commit" />
        </>
      )
    }
    case isGithubFilePreviewUrl(url): {
      const { owner, repo, afterTypeString } = parseGithubTypedUrl(url)
      const splitString = afterTypeString.split('/')
      const ref = splitString[0]
      const path = ref ? splitString.slice(1).join('/') : afterTypeString
      return (
        <>
          <MLink href={href}>{href}</MLink>
          <EmbedGithubFile
            owner={owner}
            repo={repo}
            path={path}
            refType={ref}
          />
        </>
      )
    }
    case isCodesandboxUrl(url): {
      // https://codesandbox.io/s/framer-motion-layoutroot-prop-forked-p39g96
      // to
      // https://codesandbox.io/embed/framer-motion-layoutroot-prop-forked-p39g96?fontsize=14&hidenavigation=1&theme=dark
      return (
        <FixedRatioContainer>
          <iframe
            className="absolute inset-0 h-full w-full rounded-md border-0"
            src={`https://codesandbox.io/embed/${url.pathname.slice(
              2,
            )}?fontsize=14&hidenavigation=1&theme=dark${url.search}`}
          />
        </FixedRatioContainer>
      )
    }
    case isSelfArticleUrl(url): {
      return <LinkCard source="self" id={url.pathname.slice(1)} />
    }

    default:
      return fallbackElement
  }
}

const FixedRatioContainer = ({
  children,
  ratio = 58,
}: {
  ratio?: number
  children: React.ReactNode
}) => {
  return (
    <div className="mockup-window my-16 bg-base-300">
      <div className="flex justify-center px-4">
        <div
          className="relative my-8 h-0 w-full"
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
