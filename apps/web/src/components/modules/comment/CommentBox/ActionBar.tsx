'use client'

import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { AnimatePresence, m } from 'motion/react'
import { useTranslations } from 'next-intl'

import { useIsOwnerLogged } from '~/atoms/hooks/owner'
import { TiltedSendIcon } from '~/components/icons/TiltedSendIcon'
import { Checkbox } from '~/components/ui/checkbox'
import { MarkdownLink } from '~/components/ui/link/MarkdownLink'
import { clsxm } from '~/lib/helper'

import { MAX_COMMENT_TEXT_LENGTH } from './constants'
import {
  useCommentBoxHasText,
  useCommentBoxTextIsOversize,
  useCommentBoxTextValue,
  useCommentCompact,
  useGetCommentBoxAtomValues,
  useSendComment,
  useSetCommentBoxValues,
  useUseCommentReply,
} from './hooks'
import { CommentBoxSlotProvider } from './providers'

const TextLengthIndicator = () => {
  const isTextOversize = useCommentBoxTextIsOversize()
  const commentValue = useCommentBoxTextValue()
  return (
    <span
      className={clsx(
        'font-mono text-[10px]',
        isTextOversize ? 'text-red-500' : 'text-neutral-500',
      )}
    >
      {commentValue.length}/{MAX_COMMENT_TEXT_LENGTH}
    </span>
  )
}

const WhisperCheckbox = () => {
  const t = useTranslations('comment')
  const isLogged = useIsOwnerLogged()
  const isReply = useUseCommentReply()
  const isWhisper = useAtomValue(useGetCommentBoxAtomValues().isWhisper)
  const setter = useSetCommentBoxValues()
  if (isLogged) return null
  if (isReply) return null
  return (
    <label className="label mx-2 flex items-center gap-2">
      <Checkbox
        checked={isWhisper}
        onCheckedChange={(v) => {
          if (typeof v === 'boolean') setter('isWhisper', v)
        }}
      />
      <span className="text-sm">{t('whisper')}</span>
    </label>
  )
}

const SyncToRecentlyCheckbox = () => {
  const t = useTranslations('comment')
  const isLogged = useIsOwnerLogged()
  const syncToRecently = useAtomValue(
    useGetCommentBoxAtomValues().syncToRecently,
  )
  const setter = useSetCommentBoxValues()
  const isReply = useUseCommentReply()
  if (!isLogged) return null
  if (isReply) return null
  return (
    <label className="label mx-2 flex items-center gap-2">
      <Checkbox
        checked={syncToRecently}
        onCheckedChange={(v) => {
          if (typeof v === 'boolean') setter('syncToRecently', v)
        }}
      />
      <span className="text-sm">{t('sync_to_thinking')}</span>
    </label>
  )
}

export const CommentBoxActionBar: Component = ({ className }) => {
  const t = useTranslations('comment')
  const hasCommentText = useCommentBoxHasText()
  const compact = useCommentCompact()

  return (
    <footer
      className={clsxm(
        'mt-3 flex h-5 w-full min-w-0 items-center justify-between',
        className,
      )}
    >
      <span
        className={
          'flex-1 gap-4 flex items-center select-none text-[10px] text-neutral-500 transition-opacity'
        }
      >
        {!compact && (
          <span className="hidden md:inline">
            {t('support_markdown')}
            <b>Markdown</b>
            {t('and')}{' '}
            <MarkdownLink
              noIcon
              href="https://docs.github.com/zh/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
            >
              GFM
            </MarkdownLink>
          </span>
        )}
        <CommentBoxSlotProvider />
      </span>
      <AnimatePresence>
        {hasCommentText && (
          <m.aside
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex select-none items-center gap-2.5"
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            key="send-button-wrapper"
          >
            <TextLengthIndicator />

            <WhisperCheckbox />
            <SyncToRecentlyCheckbox />
            <SubmitButton />
          </m.aside>
        )}
      </AnimatePresence>
    </footer>
  )
}

const SubmitButton = () => {
  const t = useTranslations('comment')
  const [onClickSend, isPending] = useSendComment()
  return (
    <m.button
      className="flex appearance-none items-center space-x-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isPending}
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClickSend}
    >
      <TiltedSendIcon className="size-5 text-neutral-9" />
      <m.span className="text-sm" layout="size">
        {isPending ? t('sending') : t('send')}
      </m.span>
    </m.button>
  )
}
