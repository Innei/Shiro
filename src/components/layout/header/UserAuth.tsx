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

import { appConfig } from '~/app.config'
import { UserArrowLeftIcon } from '~/components/icons/user-arrow-left'
import { FloatPopover } from '~/components/ui/float-popover'

function url(path = '') {
  return new URL(path, appConfig.site.url)
}

export function UserAuth() {
  console.log(useUser())
  const pathname = usePathname()

  return (
    <AnimatePresence>
      <SignedIn key="user-info">
        <div className="pointer-events-auto flex h-10 items-center">
          <UserButton
            afterSignOutUrl={url(pathname).href}
            appearance={{
              elements: {
                logoBox: 'w-9 h-9 ring-2 ring-white/20 rounded-full',
              },
            }}
          />
        </div>
      </SignedIn>
      <SignedOut key="sign-in">
        <FloatPopover TriggerComponent={TriggerComponent} type="tooltip">
          登陆
        </FloatPopover>
      </SignedOut>
    </AnimatePresence>
  )
}

const TriggerComponent = () => {
  const pathname = usePathname()
  return (
    <SignInButton mode="modal" redirectUrl={url(pathname).href}>
      <button
        type="button"
        className="group h-10 rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 text-sm shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
      >
        <UserArrowLeftIcon className="h-4 w-4" />
      </button>
    </SignInButton>
  )
}
