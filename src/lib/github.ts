'use client'

const gitHubEndpoint = 'https://api.github.com'
const reverseProxy = '/api/gh'

export const fetchGitHubApi = <T>(path: string) => {
  const nextPath = path.replace(gitHubEndpoint, '')

  return Promise.any([
    fetch(gitHubEndpoint + nextPath).then((res) => res.json()),
    fetch(reverseProxy + nextPath).then((res) => res.json()),
  ]) as Promise<T>
}
