import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'

import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'

import { LinkCard } from '../../link-card'
import { MLink } from './link'

const Tweet = dynamic(() => import('~/components/widgets/shared/Tweet'), {
  ssr: false,
})
export const LinkRenderer = ({ href }: { href: string }) => {
  const url = useMemo(() => {
    try {
      return new URL(href)
    } catch {
      return null
    }
  }, [href])

  if (url) {
    switch (true) {
      case isTweetUrl(url): {
        const id = getTweetId(url)

        return <Tweet id={id} />
      }

      case isGithubRepoUrl(url): {
        const [_, owner, repo] = url.pathname.split('/')
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
        const [_, owner, id] = url.pathname.split('/')
        return (
          <>
            <FixedRatioContainer>
              <iframe
                src={`https://gist.github.com/${owner}/${id}.pibb`}
                className="absolute inset-0 h-full w-full border-0"
              />
            </FixedRatioContainer>

            <a
              className="-mt-4 mb-4 flex space-x-2 center"
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
        const [_, owner, repo, type, id] = url.pathname.split('/')
        return (
          <>
            <p>
              <MLink href={href}>{href}</MLink>
            </p>
            <LinkCard id={`${owner}/${repo}/commit/${id}`} source="gh-commit" />
          </>
        )
      }
    }
  }
  // fallback to default renderer
  return (
    <p>
      <MLink href={href}>
        <span>{href}</span>
      </MLink>
    </p>
  )
}

const FixedRatioContainer = ({
  children,
  ratio = 58,
}: {
  ratio?: number
  children: React.ReactNode
}) => {
  return (
    <div
      className="relative my-8 h-0 w-full"
      style={{
        paddingBottom: `${ratio}%`,
      }}
    >
      {children}
    </div>
  )
}

const isTweetUrl = (url: URL) => {
  return url.hostname === 'twitter.com' && url.pathname.startsWith('/')
}
const getTweetId = (url: URL) => {
  return url.pathname.split('/').pop()!
}

const isGithubRepoUrl = (url: URL) => {
  return (
    url.hostname === 'github.com' &&
    url.pathname.startsWith('/') &&
    url.pathname.split('/').length === 3
  )
}

const isYoutubeUrl = (url: URL) => {
  return url.hostname === 'www.youtube.com' && url.pathname.startsWith('/watch')
}

const isGistUrl = (url: URL) => {
  return url.hostname === 'gist.github.com'
}

const isGithubCommitUrl = (url: URL) => {
  const [_, owner, repo, type, ...rest] = url.pathname.split('/')
  return url.hostname === 'github.com' && type === 'commit'
}
