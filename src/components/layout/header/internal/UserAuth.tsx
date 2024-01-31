'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { useIsLogged } from '~/atoms'
import { UserArrowLeftIcon } from '~/components/icons/user-arrow-left'
import { MotionButtonBase } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { urlBuilder } from '~/lib/url-builder'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { HeaderActionButton } from './HeaderActionButton'

const SignedIn = dynamic(() =>
  import('@clerk/nextjs').then((mod) => mod.SignedIn),
)

const UserAuthFromIcon = dynamic(() =>
  import('./UserAuthFromIcon').then((mod) => mod.UserAuthFromIcon),
)
const SignedOut = dynamic(() =>
  import('@clerk/nextjs').then((mod) => mod.SignedOut),
)
const UserButton = dynamic(() =>
  import('@clerk/nextjs').then((mod) => mod.UserButton),
)
const SignInButton = dynamic(() =>
  import('@clerk/nextjs').then((mod) => mod.SignInButton),
)

const OwnerAvatar = () => {
  const ownerAvatar = useAggregationSelector((s) => s.user.avatar)!

  return (
    <MotionButtonBase
      onClick={() => {
        window.open('/dashboard', '_blank')
      }}
      className="pointer-events-auto relative flex items-center justify-center"
    >
      <span className="sr-only">Go to dashboard</span>
      <Image
        className="rounded-full"
        height={36}
        width={36}
        src={ownerAvatar}
        alt="site owner"
      />
      <UserAuthFromIcon className="absolute -bottom-1 -right-1" />
    </MotionButtonBase>
  )
}

export function UserAuth() {
  const pathname = usePathname()
  const isLogged = useIsLogged()

  if (isLogged) {
    return <OwnerAvatar />
  }

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
          wrapperClassName="h-full w-full flex items-center justify-center"
          type="tooltip"
        >
          登录
        </FloatPopover>
      </SignedOut>
    </AnimatePresence>
  )
}

const TriggerComponent = () => {
  const pathname = usePathname()
  return (
    <SignInButton mode="modal" redirectUrl={urlBuilder(pathname).href}>
      <HeaderActionButton aria-label="Guest Login">
        <UserArrowLeftIcon className="h-4 w-4" />
      </HeaderActionButton>
    </SignInButton>
  )
}
