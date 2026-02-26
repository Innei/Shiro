'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'

import { useIsOwnerLogged } from '~/atoms/hooks/owner'
import { useSessionReader } from '~/atoms/hooks/reader'
import { MotionButtonBase } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'

import {
  CommentBoxMode,
  setCommentMode,
  useCommentBoxHasText,
  useCommentMode,
} from './hooks'

const SwitchCommentModeButton = () => {
  const t = useTranslations('comment')
  const mode = useCommentMode()
  const copyMap = {
    [CommentBoxMode.legacy]: t('switch_to_legacy'),
    [CommentBoxMode['with-auth']]: t('switch_to_auth'),
  }
  const copy = copyMap[mode]
  return (
    <>
      <i
        className={clsx(
          mode === CommentBoxMode.legacy
            ? 'i-mingcute-user-4-line'
            : 'i-material-symbols-dynamic-form-outline',
        )}
      />
      <span className="sr-only">{copy}</span>
    </>
  )
}
export const SwitchCommentMode = () => {
  const t = useTranslations('comment')
  const mode = useCommentMode()
  const copyMap = {
    [CommentBoxMode.legacy]: t('switch_to_legacy'),
    [CommentBoxMode['with-auth']]: t('switch_to_auth'),
  }
  const copy = copyMap[mode]

  const hasText = useCommentBoxHasText()

  // TODO
  const notLogged = !useSessionReader()

  const isOwnerLogged = useIsOwnerLogged()
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
