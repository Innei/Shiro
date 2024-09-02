import type { BuiltInProviderType } from 'next-auth/providers/index'
import type { FC } from 'react'

import { AppleIcon } from '~/components/icons/platform/AppleIcon'
import { LogosFacebook } from '~/components/icons/platform/FacebookIcon'
import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { GoogleBrandIcon } from '~/components/icons/platform/GoogleBrandIcon'
import { TwitterIcon } from '~/components/icons/platform/Twitter'

export const UserAuthStrategyIcon: FC<{
  strategy: BuiltInProviderType | null
  className?: string
}> = ({ strategy, className }) => {
  const Icon = getStrategyIconComponent(strategy)

  if (!strategy) {
    return null
  }

  if (!Icon) return null
  return <Icon className={className} />
}

export const getStrategyIconComponent = (
  strategy: BuiltInProviderType | null,
) => {
  switch (strategy) {
    case 'github': {
      return GitHubBrandIcon
    }
    case 'google': {
      return GoogleBrandIcon
    }
    case 'apple': {
      return AppleIcon
    }
    case 'facebook': {
      return LogosFacebook
    }
    case 'twitter': {
      return TwitterIcon
    }
    default: {
      return null
    }
  }
}
