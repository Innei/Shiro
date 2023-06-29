'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { UserArrowLeftIcon } from '~/components/icons/user-arrow-left'
import { FloatPopover } from '~/components/ui/float-popover'
import { urlBuilder } from '~/lib/url-builder'

import { HeaderActionButton } from './HeaderActionButton'

const UserAuthFromIcon = dynamic(() =>
  import('./UserAuthFromIcon').then((mod) => mod.UserAuthFromIcon),
)

const SignedIn = dynamic(() =>
  import('@clerk/nextjs').then((mod) => mod.SignedIn),
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
