import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'

import { fetchGitHubApi } from '~/lib/github'

import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

export const githubDiscussionPlugin: LinkCardPlugin = {
  name: 'gh-discussion',
  displayName: 'GitHub Discussion',
  priority: 95,
  typeClass: 'github',

  matchUrl(url: URL): UrlMatchResult | null {
    if (url.hostname !== 'github.com') return null
    if (!url.pathname.includes('/discussions/')) return null

    const parts = url.pathname.split('/').filter(Boolean)
    // owner/repo/discussions/number
    if (parts.length < 4 || parts[2] !== 'discussions') return null

    const discussionNumber = parts[3]
    if (!/^\d+$/.test(discussionNumber)) return null

    const [owner, repo] = parts
    return {
      id: `${owner}/${repo}/${discussionNumber}`,
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
    const [owner, repo, discussionNumber] = id.split('/')

    const response = await fetchGitHubApi(
      `https://api.github.com/repos/${owner}/${repo}/discussions/${discussionNumber}`,
    )
    const data = camelcaseKeys(response)

    const categoryName = data.category?.name || 'Discussion'

    return {
      title: `Discussion: ${data.title}`,
      desc: (
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
          <span className="rounded bg-base-200 px-1.5 py-0.5 text-xs">
            {categoryName}
          </span>
          <span className="text-sm opacity-80">
            #{discussionNumber} · {owner}/{repo}
          </span>
        </span>
      ),
      image: data.user?.avatarUrl,
    }
  },
}
