'use client'

import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { FC } from 'react'
import type { CommentBaseProps } from '../types'

import { SignedIn, SignedOut } from '@clerk/nextjs'

import { useIsLogged } from '~/atoms'
import { AutoResizeHeight } from '~/components/common/AutoResizeHeight'

import { CommentBoxAuthedInput } from './AuthedInput'
import { CommentBoxLegacyForm } from './CommentBoxLegacyForm'
import { CommentBoxProvider } from './providers'
import { CommentBoxSignedOutContent } from './SignedOutContent'

const enum CommentBoxMode {
  'legacy',
  'with-auth',
}

const commentModeAtom = atomWithStorage(
  'comment-mode',
  CommentBoxMode['with-auth'],
)
export const CommentBoxRoot: FC<CommentBaseProps> = (props) => {
  const { refId } = props
  const [mode, setMode] = useAtom(commentModeAtom)

  const isLogged = useIsLogged()
  useEffect(() => {
    if (isLogged) setMode(CommentBoxMode['legacy'])
  }, [isLogged])

  return (
    <CommentBoxProvider refId={refId}>
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
