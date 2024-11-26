import type { FC } from 'react'

import { AppleIcon } from '~/components/icons/platform/AppleIcon'
import { LogosFacebook } from '~/components/icons/platform/FacebookIcon'
import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { GoogleBrandIcon } from '~/components/icons/platform/GoogleBrandIcon'
import { LogosMicrosoftIcon } from '~/components/icons/platform/MicrosoftIcon'
import { TwitterIcon } from '~/components/icons/platform/Twitter'
import type { AuthSocialProviders } from '~/lib/authjs'

export const UserAuthStrategyIcon: FC<{
  strategy: AuthSocialProviders | null
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
  strategy: AuthSocialProviders | null,
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
    case 'microsoft': {
      return LogosMicrosoftIcon
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
