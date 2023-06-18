'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs'

import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { GoogleBrandIcon } from '~/components/icons/platform/GoogleBrandIcon'
import { MailIcon } from '~/components/icons/platform/MailIcon'
import { UserArrowLeftIcon } from '~/components/icons/user-arrow-left'
import { FloatPopover } from '~/components/ui/float-popover'
import { urlBuilder } from '~/lib/url-builder'
import { clsxm } from '~/utils/helper'

import { HeaderActionButton } from './HeaderActionButton'

export function UserAuth() {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      <SignedIn key="user-info">
        <div className="pointer-events-auto flex h-10 w-full items-center justify-center">
          <div className="relative">
            <UserButton
              afterSignOutUrl={urlBuilder(pathname).href}
              appearance={{
                elements: {
                  logoBox: 'w-9 h-9 ring-2 ring-white/20 rounded-full',
                },
              }}
            />
            <UserAuthFromIcon className="absolute -bottom-1 -right-1" />
          </div>
        </div>
      </SignedIn>
      <SignedOut key="sign-in">
        <FloatPopover
          TriggerComponent={TriggerComponent}
          wrapperClassNames="h-full w-full flex items-center justify-center"
          type="tooltip"
        >
          登陆
        </FloatPopover>
      </SignedOut>
    </AnimatePresence>
  )
}

const UserAuthFromIcon: Component = ({ className }) => {
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

const TriggerComponent = () => {
  const pathname = usePathname()
  return (
    <SignInButton mode="modal" redirectUrl={urlBuilder(pathname).href}>
      <HeaderActionButton>
        <UserArrowLeftIcon className="h-4 w-4" />
      </HeaderActionButton>
    </SignInButton>
  )
}
