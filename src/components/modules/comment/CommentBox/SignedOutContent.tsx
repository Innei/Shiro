'use client'

import { usePathname } from 'next/navigation'

import { SignInButton } from '@clerk/nextjs'

import { UserArrowLeftIcon } from '~/components/icons/user-arrow-left'
import { StyledButton } from '~/components/ui/button'
import { useModalStack } from '~/components/ui/modal'
import { urlBuilder } from '~/lib/url-builder'

import { CommentBoxMode, setCommentMode } from './hooks'

export function CommentBoxSignedOutContent() {
  const pathname = usePathname()
  const { dismissAll } = useModalStack()

  return (
    <div className="flex h-[150px] w-full space-x-4 rounded-lg bg-gray-100/80 center dark:bg-zinc-900/80">
      <StyledButton
        variant="secondary"
        type="button"
        onClick={() => {
          setCommentMode(CommentBoxMode.legacy)
        }}
      >
        免登录评论
      </StyledButton>
      <SignInButton
        mode="modal"
        fallbackRedirectUrl={urlBuilder(pathname).href}
      >
        <StyledButton
          onClick={() => {
            dismissAll()
          }}
          variant="primary"
          type="button"
        >
          <UserArrowLeftIcon className="mr-1 size-5" />
          登录后才可以留言噢
        </StyledButton>
      </SignInButton>
    </div>
  )
}
