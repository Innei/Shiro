import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'

import { fetchGitHubApi } from '~/lib/github'

import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

export const githubCommitPlugin: LinkCardPlugin = {
  name: 'gh-commit',
  displayName: 'GitHub Commit',
  priority: 95,
  typeClass: 'github',

  matchUrl(url: URL): UrlMatchResult | null {
    if (url.hostname !== 'github.com') return null
    const parts = url.pathname.split('/').filter(Boolean)
    // owner/repo/commit/sha
    if (parts.length < 4 || parts[2] !== 'commit') return null

    const [owner, repo, , commitId] = parts
    return {
      id: `${owner}/${repo}/commit/${commitId}`,
      fullUrl: url.toString(),
    }
  },

  isValidId(id: string): boolean {
    const parts = id.split('/')
    return (
      parts.length === 4 &&
      parts.every((part) => part.length > 0) &&
      parts[2] === 'commit'
    )
  },

  async fetch(id: string): Promise<LinkCardData> {
    const [owner, repo, , commitId] = id.split('/')

    const response = await fetchGitHubApi(
      `https://api.github.com/repos/${owner}/${repo}/commits/${commitId}`,
    )
    const data = camelcaseKeys(response)

    return {
      title: (
        <span className="font-normal">
          {data.commit.message.replace(/Signed-off-by:.+/, '')}
        </span>
      ),
      desc: (
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
          <span className="inline-flex items-center gap-2">
            <span className="text-success">+{data.stats.additions}</span>
            <span className="text-error">-{data.stats.deletions}</span>
          </span>
          <span className="text-sm">{data.sha.slice(0, 7)}</span>
          <span className="text-sm opacity-80">
            {owner}/{repo}
          </span>
        </span>
      ),
      image: data.author?.avatarUrl,
    }
  },
}
