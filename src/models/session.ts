import type { AuthSocialProviders } from '~/lib/authjs'

export interface SessionReader {
  id: string
  name: string
  email: string
  image: string
  emailVerified: null
  isOwner: boolean
  scope: string
  tokenType: string
  providerAccountId: string
  provider: AuthSocialProviders
  type: string

  handle?: string
}
