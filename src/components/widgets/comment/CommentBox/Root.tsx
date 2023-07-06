'use client'

import { useEffect } from 'react'
import type { FC } from 'react'
import type { CommentBaseProps } from '../types'

import { SignedIn, SignedOut } from '@clerk/nextjs'

import { useIsLogged } from '~/atoms'
import { AutoResizeHeight } from '~/components/widgets/shared/AutoResizeHeight'

import { CommentBoxAuthedInput } from './AuthedInput'
import { CommentBoxLegacyForm } from './CommentBoxLegacyForm'
import { CommentBoxMode, setCommentMode, useCommentMode } from './hooks'
import { CommentBoxProvider } from './providers'
import { CommentBoxSignedOutContent } from './SignedOutContent'
import { SwitchCommentMode } from './SwitchCommentMode'

export const CommentBoxRoot: FC<CommentBaseProps> = (props) => {
  const { refId } = props

  const mode = useCommentMode()

  const isLogged = useIsLogged()
  useEffect(() => {
    if (isLogged) setCommentMode(CommentBoxMode['legacy'])
  }, [isLogged])

  return (
    <CommentBoxProvider refId={refId}>
      <div className="group relative w-full min-w-0" data-hide-print>
        <SwitchCommentMode />

        <div className="relative w-full">
          {mode === CommentBoxMode.legacy ? (
            <CommentBoxLegacy />
          ) : (
            <CommentBoxWithAuth />
          )}
        </div>
      </div>
    </CommentBoxProvider>
  )
}

const CommentBoxLegacy = () => {
  return (
    <AutoResizeHeight>
      <CommentBoxLegacyForm />
    </AutoResizeHeight>
  )
}

const CommentBoxWithAuth = () => {
  return (
    <AutoResizeHeight>
      <SignedOut>
        <CommentBoxSignedOutContent />
      </SignedOut>

      <SignedIn>
        <CommentBoxAuthedInput />
      </SignedIn>
    </AutoResizeHeight>
  )
}
