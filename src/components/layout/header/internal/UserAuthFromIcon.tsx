'use client'

import React from 'react'

import { useSessionReader } from '~/atoms/hooks/reader'
import { getStrategyIconComponent } from '~/components/ui/user/UserAuthStrategyIcon'
import { clsxm } from '~/lib/helper'

export const UserAuthFromIcon: Component = ({ className }) => {
  const session = useSessionReader()
  const provider = session?.provider
  const StrategyIcon = provider && getStrategyIconComponent(provider)

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
