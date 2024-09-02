'use client'

import { useSessionReader } from '~/atoms/hooks/reader'
import { UserArrowLeftIcon } from '~/components/icons/user-arrow-left'
import { StyledButton } from '~/components/ui/button'
import { useModalStack } from '~/components/ui/modal'
import { useOauthLoginModal } from '~/queries/hooks/authjs'

import { CommentBoxMode, setCommentMode } from './hooks'

export function CommentBoxSignedOutContent() {
  const { dismissAll } = useModalStack()
  const presentOauthModal = useOauthLoginModal()

  const isReaderLogin = !!useSessionReader()
  if (isReaderLogin) return null

  return (
    <div className="center flex h-[150px] w-full space-x-4 rounded-lg bg-gray-100/80 dark:bg-zinc-900/80">
      <StyledButton
        variant="secondary"
        type="button"
        onClick={() => {
          setCommentMode(CommentBoxMode.legacy)
        }}
      >
        免登录评论
      </StyledButton>

      <StyledButton
        onClick={() => {
          dismissAll()
          presentOauthModal()
        }}
        variant="primary"
        type="button"
      >
        <UserArrowLeftIcon className="mr-1 size-5" />
        登录评论
      </StyledButton>
    </div>
  )
}
