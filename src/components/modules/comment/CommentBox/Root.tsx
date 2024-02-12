'use client'

import { useEffect } from 'react'
import type { CommentBaseProps } from '../types'

import { SignedIn, SignedOut } from '@clerk/nextjs'

import { useIsLogged } from '~/atoms/hooks'
import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { clsxm } from '~/lib/helper'

import { CommentBoxAuthedInput } from './AuthedInput'
import { CommentBoxLegacyForm } from './CommentBoxLegacyForm'
import { CommentBoxMode, setCommentMode, useCommentMode } from './hooks'
import { CommentBoxProvider } from './providers'
import { CommentBoxSignedOutContent } from './SignedOutContent'
import { SwitchCommentMode } from './SwitchCommentMode'

export const CommentBoxRoot: Component<CommentBaseProps> = (props) => {
  const { refId, className, afterSubmit, initialValue } = props

  const mode = useCommentMode()

  const isLogged = useIsLogged()
  useEffect(() => {
    if (isLogged) setCommentMode(CommentBoxMode['legacy'])
  }, [isLogged])

  return (
    <ErrorBoundary>
      <CommentBoxProvider
        refId={refId}
        afterSubmit={afterSubmit}
        initialValue={initialValue}
      >
        <div
          className={clsxm('group relative w-full min-w-0', className)}
          data-hide-print
        >
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
    </ErrorBoundary>
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
