import { useQuery } from '@tanstack/react-query'
import React, { memo, useMemo } from 'react'
import dynamic from 'next/dynamic'

import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import {
  getTweetId,
  isGistUrl,
  isGithubCommitUrl,
  isGithubFilePreviewUrl,
  isGithubRepoUrl,
  isTweetUrl,
  isYoutubeUrl,
  parseGithubGistUrl,
  parseGithubRepoUrl,
  parseGithubTypedUrl,
} from '~/lib/link-parser'

import { HighLighter } from '../../code-highlighter'
import { LinkCard } from '../../link-card'
import { Loading } from '../../loading'
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
              className="max-h-[300px] w-full overflow-auto border-0"
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
        const sha = splitString[0].length === 40 ? splitString[0] : undefined
        const path = sha ? splitString.slice(1).join('/') : afterTypeString
        return (
          <>
            <MLink href={href}>{href}</MLink>
            <EmbedGithubFile owner={owner} repo={repo} path={path} sha={sha} />
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

const EmbedGithubFile = memo(
  ({
    owner,
    path,
    repo,
    sha,
  }: {
    owner: string
    repo: string
    path: string
    sha?: string
  }) => {
    const { data, isLoading, isError } = useQuery<string>({
      queryKey: ['github-preview', owner, repo, path, sha],
      queryFn: async () => {
        return fetch(
          `https://cdn.jsdelivr.net/gh/${owner}/${repo}${
            sha ? `@${sha}` : ''
          }/${path}`,
        ).then(async (res) => {
          return res.text()
        })
      },
    })

    if (isLoading) {
      return <Loading loadingText="Loading GitHub File Preview..." />
    }

    if (isError) {
      return (
        <pre className="flex h-[60px] flex-wrap center">
          <code>Loading GitHub File Preview Failed:</code>
          <br />
          <code>
            {owner}/{repo}/{path}
          </code>
        </pre>
      )
    }

    if (!data) return null

    return (
      <div className="h-[50vh] overflow-auto">
        <HighLighter content={data} lang="javascript" />
      </div>
    )
  },
)

EmbedGithubFile.displayName = 'EmbedGithubFile'
