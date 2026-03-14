'use client'

import { useEffect } from 'react'

import { useIsOwnerLogged } from '~/atoms/hooks/owner'
import { useSessionReader } from '~/atoms/hooks/reader'
import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { clsxm } from '~/lib/helper'

import type { CommentBaseProps } from '../types'
import { CommentBoxAuthedInput } from './AuthedInput'
import { CommentBoxLegacyForm } from './CommentBoxLegacyForm'
import { CommentBoxMode, setCommentMode, useCommentMode } from './hooks'
import { CommentBoxProvider, CommentCompactContext } from './providers'
import { CommentBoxSignedOutContent } from './SignedOutContent'
import { SwitchCommentMode } from './SwitchCommentMode'

export const CommentBoxRoot: Component<CommentBaseProps> = (props) => {
  const {
    refId,
    className,
    afterSubmit,
    initialValue,
    autoFocus,
    anchor,
    compact,
  } = props

  const mode = useCommentMode()

  const isLogged = useIsOwnerLogged()

  const sessionReader = useSessionReader()

  useEffect(() => {
    if (sessionReader) {
      setCommentMode(CommentBoxMode['with-auth'])
    }
  }, [sessionReader])

  return (
    <ErrorBoundary>
      <CommentCompactContext value={!!compact}>
        <CommentBoxProvider
          afterSubmit={afterSubmit}
          anchor={anchor}
          initialValue={initialValue}
          refId={refId}
        >
          <div
            data-hide-print
            className={clsxm('group relative w-full min-w-0', className)}
          >
            {!compact && <SwitchCommentMode />}

            <div className="relative w-full">
              {isLogged ? (
                <CommentBoxLegacy autoFocus={autoFocus} />
              ) : mode === CommentBoxMode.legacy ? (
                <CommentBoxLegacy autoFocus={autoFocus} />
              ) : (
                <CommentBoxWithAuth autoFocus={autoFocus} />
              )}
            </div>
          </div>
        </CommentBoxProvider>
      </CommentCompactContext>
    </ErrorBoundary>
  )
}

const CommentBoxLegacy: Component<{ autoFocus?: boolean }> = ({
  autoFocus,
}) => (
  <AutoResizeHeight>
    <CommentBoxLegacyForm autoFocus={autoFocus} />
  </AutoResizeHeight>
)

const CommentBoxWithAuth: Component<{ autoFocus?: boolean }> = ({
  autoFocus,
}) => {
  const isReaderLogin = !!useSessionReader()

  return (
    <AutoResizeHeight>
      {!isReaderLogin ? (
        <CommentBoxSignedOutContent />
      ) : (
        <CommentBoxAuthedInput autoFocus={autoFocus} />
      )}
    </AutoResizeHeight>
  )
}
