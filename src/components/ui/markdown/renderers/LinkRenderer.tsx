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
