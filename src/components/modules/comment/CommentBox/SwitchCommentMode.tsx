'use client'

import clsx from 'clsx'

import { useIsLogged } from '~/atoms/hooks'
import { useSessionReader } from '~/atoms/hooks/reader'
import { MotionButtonBase } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'

import {
  CommentBoxMode,
  setCommentMode,
  useCommentBoxHasText,
  useCommentMode,
} from './hooks'

const copyMap = {
  [CommentBoxMode.legacy]: '新版评论',
  [CommentBoxMode['with-auth']]: '旧版评论',
}
const SwitchCommentModeButton = () => {
  const mode = useCommentMode()
  const copy = `转换到${copyMap[mode]}`
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
}
export const SwitchCommentMode = () => {
  const mode = useCommentMode()
  const copy = `转换到${copyMap[mode]}`

  const hasText = useCommentBoxHasText()

  // TODO
  const notLogged = !useSessionReader()

  const isOwnerLogged = useIsLogged()
  if (isOwnerLogged) return null
  return (
    <MotionButtonBase
      className={clsx(
        'absolute left-0 top-0 z-10 rounded-full text-sm',
        'size-6 border border-slate-200 dark:border-neutral-800',
        'bg-slate-100 dark:bg-neutral-900',
        'center flex cursor-pointer',
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
      <FloatPopover type="tooltip" TriggerComponent={SwitchCommentModeButton}>
        {copy}
      </FloatPopover>
    </MotionButtonBase>
  )
}
