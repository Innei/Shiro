'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { useIsLogged, useResolveAdminUrl } from '~/atoms'
import { MotionButtonBase } from '~/components/ui/button'
import { urlBuilder } from '~/lib/url-builder'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

const UserAuthFromIcon = dynamic(() =>
  import('./UserAuthFromIcon').then((mod) => mod.UserAuthFromIcon),
)

const SignedIn = dynamic(() =>
  import('@clerk/nextjs').then((mod) => mod.SignedIn),
)

const UserButton = dynamic(() =>
  import('@clerk/nextjs').then((mod) => mod.UserButton),
)

const OwnerAvatar = () => {
  const ownerAvatar = useAggregationSelector((s) => s.user.avatar)!
  const resolveAdminUrl = useResolveAdminUrl()
  return (
    <MotionButtonBase
      onClick={() => {
        window.open(resolveAdminUrl(), '_blank')
      }}
      className="pointer-events-auto flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"
    >
      <span className="sr-only">Go to dashboard</span>
      <img src={ownerAvatar} alt="site owner" />
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
    </AnimatePresence>
  )
}
