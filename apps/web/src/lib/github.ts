'use client'

const gitHubEndpoint = 'https://api.github.com'
const reverseProxy = '/api/gh'

export const fetchGitHubApi = <T>(path: string) => {
  const nextPath = path.replace(gitHubEndpoint, '')

  return Promise.any([
    fetch(gitHubEndpoint + nextPath).then((res) => {
      if (res.status === 403) {
        throw new Error('GitHub API rate limit exceeded')
      }

      return res.json()
    }),
    fetch(reverseProxy + nextPath).then((res) => res.json()),
  ]) as Promise<T>
}
