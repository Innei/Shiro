'use client'

import { useSessionReader } from '~/atoms/hooks/reader'
import { StyledButton } from '~/components/ui/button'
import { AuthProvidersRender } from '~/queries/hooks/authjs'

import { CommentBoxMode, setCommentMode } from './hooks'

export function CommentBoxSignedOutContent() {
  const isReaderLogin = !!useSessionReader()
  if (isReaderLogin) return null

  return (
    <div className="center flex h-[150px] w-full flex-col rounded-lg bg-gray-100/80 dark:bg-zinc-900/80">
      <p className="mb-4 text-sm">使用社交账号登录</p>
      <AuthProvidersRender />

      <StyledButton
        className="mt-6"
        variant="secondary"
        type="button"
        onClick={() => {
          setCommentMode(CommentBoxMode.legacy)
        }}
      >
        免登录评论
      </StyledButton>
    </div>
  )
}
