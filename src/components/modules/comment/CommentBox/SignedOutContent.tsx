'use client'

import clsx from 'clsx'
import { useEffect } from 'react'

import { useSessionReader } from '~/atoms/hooks/reader'
import { StyledButton } from '~/components/ui/button'
import { AuthProvidersRender, useAuthProviders } from '~/queries/hooks/authjs'

import { CommentBoxMode, setCommentMode } from './hooks'

export function CommentBoxSignedOutContent() {
  const isReaderLogin = !!useSessionReader()
  const providers = useAuthProviders()
  const hasProviders = providers && Object.keys(providers).length > 0

  useEffect(() => {
    if (!providers) return
    if (Object.keys(providers).length === 0) {
      setCommentMode(CommentBoxMode.legacy)
    }
  }, [providers])

  if (isReaderLogin) return null

  return (
    <div className="center flex h-[150px] w-full flex-col rounded-lg bg-gray-100/80 dark:bg-zinc-900/80">
      <p className="mb-4 text-sm">使用社交账号登录</p>
      <AuthProvidersRender />

      <StyledButton
        className={clsx(hasProviders ? 'mt-6' : '')}
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
