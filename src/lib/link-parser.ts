export const isTweetUrl = (url: URL) => {
  return url.hostname === 'twitter.com' && url.pathname.startsWith('/')
}

export const getTweetId = (url: URL) => {
  return url.pathname.split('/').pop()!
}

export const isGithubRepoUrl = (url: URL) => {
  return (
    url.hostname === 'github.com' &&
    url.pathname.startsWith('/') &&
    url.pathname.split('/').length === 3
  )
}

export const isYoutubeUrl = (url: URL) => {
  return url.hostname === 'www.youtube.com' && url.pathname.startsWith('/watch')
}

export const isGistUrl = (url: URL) => {
  return url.hostname === 'gist.github.com'
}

export const isGithubCommitUrl = (url: URL) => {
  const [_, owner, repo, type, ...rest] = url.pathname.split('/')
  return url.hostname === 'github.com' && type === 'commit'
}

export const isGithubProfileUrl = (url: URL) => {
  return url.hostname === 'github.com' && url.pathname.split('/').length === 2
}

export const isGithubFilePreviewUrl = (url: URL) => {
  // https://github.com/Innei/sprightly/blob/14234594f44956e6f56f1f92952ce82db37ef4df/src/socket/handler.ts
  const [_, owner, repo, type, ...rest] = url.pathname.split('/')
  return url.hostname === 'github.com' && type === 'blob'
}

export const isTwitterProfileUrl = (url: URL) => {
  return url.hostname === 'twitter.com' && url.pathname.split('/').length === 2
}

export const isGithubUrl = (url: URL) => {
  return url.hostname === 'github.com'
}

export const isTwitterUrl = (url: URL) => {
  return url.hostname === 'twitter.com'
}

export const isTelegramUrl = (url: URL) => {
  return url.hostname === 't.me'
}

export const parseGithubRepoUrl = (url: URL) => {
  const [_, owner, repo] = url.pathname.split('/')
  return {
    owner,
    repo,
  }
}

export const parseGithubGistUrl = (url: URL) => {
  const [_, owner, id] = url.pathname.split('/')
  return {
    owner,
    id,
  }
}

export const parseGithubTypedUrl = (url: URL) => {
  // https://github.com/Innei/sprightly/blob/14234594f44956e6f56f1f92952ce82db37ef4df/src/socket/handler.ts
  // https://github.com/mx-space/core/commit/e1b4d881cf18e1cb66294d2620eada35937d9a12
  const split = url.pathname.split('/')
  const [_, owner, repo, type, id] = split

  const afterTypeString = split.slice(4).join('/')
  return {
    owner,
    repo,
    type,
    id,
    afterTypeString,
  }
}
