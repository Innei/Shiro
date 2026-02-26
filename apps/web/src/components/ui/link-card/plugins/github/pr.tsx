import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'

import { fetchGitHubApi } from '~/lib/github'

import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

type PrState = 'open' | 'merged' | 'closed'

const getPrState = (data: { state: string; merged: boolean }): PrState => {
  if (data.merged) return 'merged'
  return data.state as PrState
}

const stateStyleMap: Record<PrState, string> = {
  open: 'text-success',
  merged: 'text-purple-500',
  closed: 'text-error',
}

const stateTextMap: Record<PrState, string> = {
  open: 'Open',
  merged: 'Merged',
  closed: 'Closed',
}

const stateColorMap: Record<PrState, string> = {
  open: '#238636',
  merged: '#8957e5',
  closed: '#f85149',
}

export const githubPrPlugin: LinkCardPlugin = {
  name: 'gh-pr',
  displayName: 'GitHub Pull Request',
  priority: 95,
  typeClass: 'github',

  matchUrl(url: URL): UrlMatchResult | null {
    if (url.hostname !== 'github.com') return null
    if (!url.pathname.includes('/pull/')) return null

    const parts = url.pathname.split('/').filter(Boolean)
    // owner/repo/pull/number
    if (parts.length < 4 || parts[2] !== 'pull') return null

    const [owner, repo, , prNumber] = parts
    return {
      id: `${owner}/${repo}/${prNumber}`,
      fullUrl: url.toString(),
    }
  },

  isValidId(id: string): boolean {
    const parts = id.split('/')
    return parts.length === 3 && parts.every((part) => part.length > 0)
  },

  async fetch(id: string): Promise<LinkCardData> {
    const [owner, repo, prNumber] = id.split('/')

    const response = await fetchGitHubApi(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    )
    const data = camelcaseKeys(response)

    const state = getPrState(data)
    const stateClass = stateStyleMap[state]
    const stateText = stateTextMap[state]
    const color = stateColorMap[state]

    return {
      title: `PR: ${data.title}`,
      color,
      desc: (
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
          <span className={stateClass}>{stateText}</span>
          <span className="inline-flex flex-nowrap items-center gap-2 whitespace-nowrap">
            <span className="text-success">+{data.additions}</span>
            <span className="text-error">-{data.deletions}</span>
          </span>
          <span className="text-sm opacity-80">
            {owner}/{repo}
          </span>
        </span>
      ),
      image: data.user.avatarUrl,
    }
  },
}
