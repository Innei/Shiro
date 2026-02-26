import { createAuthClient } from 'better-auth/react'

import { API_URL } from '~/constants/env'

export const authClient = createAuthClient({
  baseURL: `${API_URL}/auth`,
  fetchOptions: {
    credentials: 'include',
  },
})

export type AuthSocialProviders =
  | 'apple'
  | 'discord'
  | 'facebook'
  | 'github'
  | 'google'
  | 'microsoft'
  | 'spotify'
  | 'twitch'
  | 'twitter'
  | 'dropbox'
  | 'linkedin'
  | 'gitlab'

export const getUserUrl = <
  T extends { handle?: string; provider: AuthSocialProviders },
>(
  user: T,
) => {
  if (!user.handle) return
  switch (user.provider) {
    case 'github': {
      return `https://github.com/${user.handle}`
    }
  }

  return
}

const { useSession } = authClient
export { useSession }
