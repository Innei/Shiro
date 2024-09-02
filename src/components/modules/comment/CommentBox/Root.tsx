'use client'

import { useEffect } from 'react'

import { useIsLogged } from '~/atoms/hooks'
import { useSessionReader } from '~/atoms/hooks/reader'
import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { clsxm } from '~/lib/helper'

import type { CommentBaseProps } from '../types'
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

  const sessionReader = useSessionReader()

  useEffect(() => {
    if (sessionReader) {
      setCommentMode(CommentBoxMode['with-auth'])
    }
  }, [sessionReader])

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
            {isLogged ? (
              <CommentBoxLegacy />
            ) : mode === CommentBoxMode.legacy ? (
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

const CommentBoxLegacy = () => (
  <AutoResizeHeight>
    <CommentBoxLegacyForm />
  </AutoResizeHeight>
)

const CommentBoxWithAuth = () => {
  const isReaderLogin = !!useSessionReader()

  return (
    <AutoResizeHeight>
      {!isReaderLogin ? (
        <CommentBoxSignedOutContent />
      ) : (
        <CommentBoxAuthedInput />
      )}
    </AutoResizeHeight>
  )
}
