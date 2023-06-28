'use client'

import { useState } from 'react'
import type { FC } from 'react'
import type { CommentBaseProps } from '../types'

import { SignedIn, SignedOut } from '@clerk/nextjs'

import { AutoResizeHeight } from '~/components/common/AutoResizeHeight'

import { CommentBoxAuthedInput } from './AuthedInput'
import { CommentBoxProvider } from './providers'
import { CommentBoxSignedOutContent } from './SignedOutContent'

const enum CommentBoxMode {
  'legacy',
  'with-auth',
}

export const CommentBoxRoot: FC<CommentBaseProps> = (props) => {
  const { refId } = props
  const [mode, setMode] = useState<CommentBoxMode>(CommentBoxMode['with-auth'])
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
  return null
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
