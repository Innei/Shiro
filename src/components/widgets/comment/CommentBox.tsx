'use client'

import { createContext, useRef, useState } from 'react'
import clsx from 'clsx'
import { atom } from 'jotai'
import { usePathname } from 'next/navigation'
import { tv } from 'tailwind-variants'
import type { FC, PropsWithChildren } from 'react'
import type { CommentBaseProps } from './types'

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs'

import { AutoResizeHeight } from '~/components/common/AutoResizeHeight'
import { UserArrowLeftIcon } from '~/components/icons/user-arrow-left'
import { StyledButton } from '~/components/ui/button'
import { urlBuilder } from '~/lib/url-builder'

const createInitialValue = () => ({
  text: atom(''),
  refId: atom(''),
})
const CommentBoxContext = createContext(createInitialValue())

const CommentBoxProvider = (props: PropsWithChildren) => {
  return (
    <CommentBoxContext.Provider value={useRef(createInitialValue()).current}>
      {props.children}
    </CommentBoxContext.Provider>
  )
}

const enum CommentBoxMode {
  'legacy',
  'with-auth',
}
export const CommentBox: FC<CommentBaseProps> = (props) => {
  const [mode, setMode] = useState<CommentBoxMode>(CommentBoxMode['with-auth'])
  return (
    <CommentBoxProvider>
      <div className="relative w-full">
        {mode === CommentBoxMode.legacy ? (
          <CommentBoxLegacy />
        ) : (
          <CommentBoxWithAuth />
        )}
      </div>
    </CommentBoxProvider>
  )
}

const CommentBoxLegacy = () => {
  return null
}

const inputStyles = tv({
  base: 'h-[150px] w-full rounded-lg bg-gray-100/80 dark:bg-zinc-900/80',
  variants: {
    type: {
      auth: 'flex center',
      input: '',
    },
  },
})

const CommentBoxWithAuth = () => {
  return (
    <AutoResizeHeight>
      <SignedOut>
        <CommentBoxSignedOutContent />
      </SignedOut>

      <SignedIn>
        <CommentAuthedInput />
      </SignedIn>
    </AutoResizeHeight>
  )
}
const CommentAuthedInputSkeleton = () => {
  const color = 'bg-gray-200/50 dark:bg-zinc-800/50'
  return (
    <div className="flex animate-pulse gap-4">
      <div
        className={clsx(
          'h-12 w-12 self-end overflow-hidden rounded-full',
          color,
        )}
      />
      <div className={clsx('h-[150px] w-full rounded-lg', color)} />
    </div>
  )
}
const CommentAuthedInput = () => {
  const { user } = useUser()
  if (!user) return <CommentAuthedInputSkeleton />
  return (
    <div className="flex space-x-4">
      <div className="ml-2 h-12 w-12 flex-shrink-0 select-none self-end rounded-full bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800" />
      <div className="relative h-[150px] w-full">
        <textarea
          className={clsx(
            'h-full w-full rounded-lg text-neutral-900/80 dark:text-slate-100/80',
            'overflow-auto bg-gray-200/50 px-3 py-4 dark:bg-zinc-800/50',
          )}
        />
      </div>
    </div>
  )
}

const CommentBoxSignedOutContent = () => {
  const pathname = usePathname()

  return (
    <SignInButton mode="modal" redirectUrl={urlBuilder(pathname).href}>
      <div
        className={inputStyles({
          type: 'auth',
        })}
      >
        <StyledButton variant="secondary" type="button">
          <UserArrowLeftIcon className="mr-1 h-5 w-5" />
          登录后才可以留言噢
        </StyledButton>
      </div>
    </SignInButton>
  )
}
