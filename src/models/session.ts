import type { BuiltInProviderType } from 'next-auth/providers/index'

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
  provider: BuiltInProviderType
  type: string

  handle?: string
}
