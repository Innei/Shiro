import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'

import { LanguageToColorMap } from '~/constants/language'
import { fetchGitHubApi } from '~/lib/github'

import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

export const githubRepoPlugin: LinkCardPlugin = {
  name: 'gh-repo',
  displayName: 'GitHub Repository',
  priority: 100,
  typeClass: 'github',

  matchUrl(url: URL): UrlMatchResult | null {
    if (url.hostname !== 'github.com') return null
    const parts = url.pathname.split('/').filter(Boolean)
    // Must be exactly owner/repo format (no additional path segments)
    if (parts.length !== 2) return null

    const [owner, repo] = parts
    if (!owner || !repo) return null

    return {
      id: `${owner}/${repo}`,
      fullUrl: url.toString(),
    }
  },

  isValidId(id: string): boolean {
    const parts = id.split('/')
    return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0
  },

  async fetch(id: string): Promise<LinkCardData> {
    const [owner, repo] = id.split('/')

    const response = await fetchGitHubApi(
      `https://api.github.com/repos/${owner}/${repo}`,
    )
    const data = camelcaseKeys(response)

    return {
      title: (
        <span className="flex items-center gap-2">
          <span className="flex-1">{data.name}</span>
          <span className="shrink-0 place-self-end">
            {data.stargazersCount > 0 && (
              <span className="inline-flex shrink-0 items-center gap-1 self-center text-sm text-orange-400 dark:text-yellow-500">
                <i className="i-mingcute-star-line" />
                <span className="font-sans font-medium">
                  {data.stargazersCount}
                </span>
              </span>
            )}
          </span>
        </span>
      ),
      desc: data.description,
      image: data.owner.avatarUrl,
      color: (LanguageToColorMap as any)[data.language?.toLowerCase()],
    }
  },
}
