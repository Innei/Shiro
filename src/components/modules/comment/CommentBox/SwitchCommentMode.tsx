'use client'

import { useRef } from 'react'
import clsx from 'clsx'
import type { FC } from 'react'

import { useUser } from '@clerk/nextjs'

import { useIsLogged } from '~/atoms/hooks'
import { MotionButtonBase } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'

import {
  CommentBoxMode,
  setCommentMode,
  useCommentBoxHasText,
  useCommentMode,
} from './hooks'

export const SwitchCommentMode = () => {
  const mode = useCommentMode()
  const copy = `转换到${mode === CommentBoxMode.legacy ? '新' : '旧'}版评论`
  const hasText = useCommentBoxHasText()

  const notLogged = !!useUser()

  const TriggerComponent = useRef<FC>(function SwitchCommentModeButton() {
    const mode = useCommentMode()

    return (
      <>
        <i
          className={clsx(
            mode === CommentBoxMode.legacy
              ? 'icon-[mingcute--user-4-line]'
              : 'icon-[material-symbols--dynamic-form-outline]',
          )}
        />
        <span className="sr-only">{copy}</span>
      </>
    )
  }).current

  const isOwnerLogged = useIsLogged()
  if (isOwnerLogged) return null
  return (
    <MotionButtonBase
      className={clsx(
        'absolute left-0 top-0 z-10 rounded-full text-sm',
        'h-6 w-6 border border-slate-200 dark:border-neutral-800',
        'bg-slate-100 dark:bg-neutral-900',
        'flex cursor-pointer text-base-100/50 center',
        'text-base-content/50',
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
      <FloatPopover TriggerComponent={TriggerComponent}>{copy}</FloatPopover>
    </MotionButtonBase>
  )
}
