import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'

import { fetchGitHubApi } from '~/lib/github'

import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

const stateColorMap: Record<string, string> = {
  open: 'text-success',
  closed: 'text-error',
}

const stateTextMap: Record<string, string> = {
  open: 'Open',
  closed: 'Closed',
}

const stateThemeColorMap: Record<string, string> = {
  open: '#238636',
  closed: '#f85149',
}

export const githubIssuePlugin: LinkCardPlugin = {
  name: 'gh-issue',
  displayName: 'GitHub Issue',
  priority: 95,
  typeClass: 'github',

  matchUrl(url: URL): UrlMatchResult | null {
    if (url.hostname !== 'github.com') return null
    if (!url.pathname.includes('/issues/')) return null

    const parts = url.pathname.split('/').filter(Boolean)
    // owner/repo/issues/number
    if (parts.length < 4 || parts[2] !== 'issues') return null

    const issueNumber = parts[3]
    // Ensure it's a number (not "new" or other paths)
    if (!/^\d+$/.test(issueNumber)) return null

    const [owner, repo] = parts
    return {
      id: `${owner}/${repo}/${issueNumber}`,
      fullUrl: url.toString(),
    }
  },

  isValidId(id: string): boolean {
    const parts = id.split('/')
    return (
      parts.length === 3 &&
      parts.every((part) => part.length > 0) &&
      /^\d+$/.test(parts[2])
    )
  },

  async fetch(id: string): Promise<LinkCardData> {
    const [owner, repo, issueNumber] = id.split('/')

    const response = await fetchGitHubApi(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
    )
    const data = camelcaseKeys(response)

    const stateClass = stateColorMap[data.state] || 'text-base-content/60'
    const stateText = stateTextMap[data.state] || data.state
    const color = stateThemeColorMap[data.state]

    return {
      title: `Issue: ${data.title}`,
      color,
      desc: (
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
          <span className={stateClass}>{stateText}</span>
          <span className="text-sm opacity-80">
            #{issueNumber} · {owner}/{repo}
          </span>
        </span>
      ),
      image: data.user?.avatarUrl,
    }
  },
}
