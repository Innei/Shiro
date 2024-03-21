'use client'

import React from 'react'

import { useUser } from '@clerk/nextjs'

import { getStrategyIconComponent } from '~/components/ui/user/UserAuthStrategyIcon'
import { clsxm } from '~/lib/helper'

export const UserAuthFromIcon: Component = ({ className }) => {
  const { user } = useUser()
  const StrategyIcon = React.useMemo(() => {
    const strategy = user?.primaryEmailAddress?.verification.strategy
    if (!strategy) {
      return null
    }
    return getStrategyIconComponent(strategy)
  }, [user?.primaryEmailAddress?.verification.strategy])

  if (!StrategyIcon) {
    return null
  }

  return (
    <span
      className={clsxm(
        'pointer-events-none flex size-4 select-none items-center justify-center rounded-full bg-white dark:bg-zinc-900',
        className,
      )}
    >
      <StrategyIcon className="size-3" />
    </span>
  )
}
