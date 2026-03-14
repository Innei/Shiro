'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { useSessionReader } from '~/atoms/hooks/reader'
import { StyledButton } from '~/components/ui/button'
import { AuthProvidersRender, useAuthProviders } from '~/queries/hooks/authjs'

import { CommentBoxMode, setCommentMode } from './hooks'

export function CommentBoxSignedOutContent() {
  const t = useTranslations('comment')
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
    <div className="center flex h-[150px] w-full flex-col rounded-lg bg-neutral-100/80 dark:bg-neutral-900/80">
      {hasProviders && (
        <>
          <p className="mb-4 text-sm">{t('signIn_social')}</p>
          <AuthProvidersRender />
        </>
      )}

      <StyledButton
        className={clsx(hasProviders ? 'mt-6' : '')}
        type="button"
        variant="secondary"
        onClick={() => {
          setCommentMode(CommentBoxMode.legacy)
        }}
      >
        {t('guest_comment')}
      </StyledButton>
    </div>
  )
}
