'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

import { appConfig } from '~/app.config'
import { UserArrowLeftIcon } from '~/components/icons/user-arrow-left'
import { FloatPopover } from '~/components/ui/float-popover'

import { HeaderActionButton } from './HeaderActionButton'

function url(path = '') {
  return new URL(path, appConfig.site.url)
}

export function UserAuth() {
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

const TriggerComponent = () => {
  const pathname = usePathname()
  return (
    <SignInButton mode="modal" redirectUrl={url(pathname).href}>
      <HeaderActionButton>
        <UserArrowLeftIcon className="h-4 w-4" />
      </HeaderActionButton>
    </SignInButton>
  )
}
