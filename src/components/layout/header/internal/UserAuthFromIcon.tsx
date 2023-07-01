'use client'

import React from 'react'

import { useUser } from '@clerk/nextjs'

import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { GoogleBrandIcon } from '~/components/icons/platform/GoogleBrandIcon'
import { MailIcon } from '~/components/icons/platform/MailIcon'
import { clsxm } from '~/lib/helper'

export const UserAuthFromIcon: Component = ({ className }) => {
  const { user } = useUser()
  const StrategyIcon = React.useMemo(() => {
    const strategy = user?.primaryEmailAddress?.verification.strategy
    if (!strategy) {
      return null
    }

    switch (strategy) {
      case 'from_oauth_github':
        return GitHubBrandIcon
      case 'from_oauth_google':
        return GoogleBrandIcon
      default:
        return MailIcon
    }
  }, [user?.primaryEmailAddress?.verification.strategy])

  if (!StrategyIcon) {
    return null
  }

  return (
    <span
      className={clsxm(
        'pointer-events-none flex h-4 w-4 select-none items-center justify-center rounded-full bg-white dark:bg-zinc-900',
        className,
      )}
    >
      <StrategyIcon className="h-3 w-3" />
    </span>
  )
}
