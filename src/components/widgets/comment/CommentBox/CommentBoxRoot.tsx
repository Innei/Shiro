'use client'

import { useState } from 'react'
import type { FC } from 'react'
import type { CommentBaseProps } from '../types'

import { SignedIn, SignedOut } from '@clerk/nextjs'

import { AutoResizeHeight } from '~/components/common/AutoResizeHeight'

import { CommentAuthedInput } from './CommentAuthedInput'
import { CommentBoxProvider } from './CommentBoxProvider'
import { CommentBoxSignedOutContent } from './CommentBoxSignedOutContent'

const enum CommentBoxMode {
  'legacy',
  'with-auth',
}

export const CommentBoxRoot: FC<CommentBaseProps> = (props) => {
  const [mode, setMode] = useState<CommentBoxMode>(CommentBoxMode['with-auth'])
  return (
    <CommentBoxProvider>
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
        <CommentAuthedInput />
      </SignedIn>
    </AutoResizeHeight>
  )
}
