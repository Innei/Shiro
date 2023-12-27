import type { FC } from 'react'

import { AppleIcon } from '~/components/icons/platform/AppleIcon'
import { LogosFacebook } from '~/components/icons/platform/FacebookIcon'
import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { GoogleBrandIcon } from '~/components/icons/platform/GoogleBrandIcon'
import { LogosMicrosoftIcon } from '~/components/icons/platform/MicrosoftIcon'
import { TwitterIcon } from '~/components/icons/platform/Twitter'

export const UserAuthStrategyIcon: FC<{
  strategy: string
  className?: string
}> = ({ strategy, className }) => {
  const Icon = getStrategyIconComponent(strategy)

  if (!strategy) {
    return null
  }

  if (!Icon) return null
  return <Icon className={className} />
}

export const getStrategyIconComponent = (strategy: string) => {
  switch (strategy) {
    case 'from_oauth_github':
      return GitHubBrandIcon
    case 'from_oauth_google':
      return GoogleBrandIcon
    case 'from_oauth_apple':
      return AppleIcon
    case 'from_oauth_microsoft':
      return LogosMicrosoftIcon
    case 'from_oauth_facebook':
      return LogosFacebook
    case 'from_oauth_twitter':
      return TwitterIcon
    default:
      return null
  }
}
