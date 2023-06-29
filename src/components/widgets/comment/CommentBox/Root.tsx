'use client'

import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import type { FC } from 'react'
import type { CommentBaseProps } from '../types'

import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'

import { useIsLogged } from '~/atoms'
import { AutoResizeHeight } from '~/components/common/AutoResizeHeight'
import { MotionButtonBase } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'

import { CommentBoxAuthedInput } from './AuthedInput'
import { CommentBoxLegacyForm } from './CommentBoxLegacyForm'
import {
  CommentBoxMode,
  setCommentMode,
  useCommentBoxHasText,
  useCommentMode,
} from './hooks'
import { CommentBoxProvider } from './providers'
import { CommentBoxSignedOutContent } from './SignedOutContent'

export const CommentBoxRoot: FC<CommentBaseProps> = (props) => {
  const { refId } = props

  const mode = useCommentMode()

  const isLogged = useIsLogged()
  useEffect(() => {
    if (isLogged) setCommentMode(CommentBoxMode['legacy'])
  }, [isLogged])

  return (
    <CommentBoxProvider refId={refId}>
      <div className="group relative w-full min-w-0">
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

const SwitchCommentMode = () => {
  const mode = useCommentMode()
  const copy = `转换到${mode === CommentBoxMode.legacy ? '新' : '旧'}版评论`
  const TriggerComponent = useRef<FC>(function SwitchCommentModeButton() {
    const mode = useCommentMode()

    const hasText = useCommentBoxHasText()

    const notLogged = !!useUser()

    return (
      <MotionButtonBase
        className={clsx(
          'absolute left-0 top-0 z-10 rounded-full text-sm',
          'h-6 w-6 border border-slate-200 dark:border-neutral-800',
          'flex cursor-pointer text-base-100/50 center',
          'opacity-0 transition-opacity duration-200 group-[:hover]:opacity-100',
          mode === CommentBoxMode['legacy'] && 'bottom-0 top-auto',
          hasText ||
            (notLogged &&
              mode === CommentBoxMode['with-auth'] &&
              'invisible opacity-0'),
        )}
        onClick={() => {
          setCommentMode(
            mode === CommentBoxMode.legacy
              ? CommentBoxMode['with-auth']
              : CommentBoxMode['legacy'],
          )
        }}
      >
        <i
          className={clsx(
            mode === CommentBoxMode.legacy
              ? 'icon-[mingcute--user-4-line]'
              : 'icon-[material-symbols--dynamic-form-outline]',
          )}
        />
        <span className="sr-only">{copy}</span>
      </MotionButtonBase>
    )
  }).current
  return <FloatPopover TriggerComponent={TriggerComponent}>{copy}</FloatPopover>
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
