import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'

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
          <div className="relative h-0 w-full pb-[56%]">
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
            />
          </div>
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
