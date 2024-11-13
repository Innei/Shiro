'use client'

import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { AnimatePresence, m } from 'motion/react'

import { useIsLogged } from '~/atoms/hooks'
import { TiltedSendIcon } from '~/components/icons/TiltedSendIcon'
import { MLink } from '~/components/ui/link/MLink'
import { clsxm } from '~/lib/helper'

import { MAX_COMMENT_TEXT_LENGTH } from './constants'
import {
  useCommentBoxHasText,
  useCommentBoxTextIsOversize,
  useCommentBoxTextValue,
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
        isTextOversize ? 'text-red-500' : 'text-zinc-500',
      )}
    >
      {commentValue.length}/{MAX_COMMENT_TEXT_LENGTH}
    </span>
  )
}

const WhisperCheckbox = () => {
  const isLogged = useIsLogged()
  const isReply = useUseCommentReply()
  const isWhisper = useAtomValue(useGetCommentBoxAtomValues().isWhisper)
  const setter = useSetCommentBoxValues()
  if (isLogged) return null
  if (isReply) return null
  return (
    <label className="label mx-2 flex items-center">
      <input
        className="checkbox-accent checkbox checkbox-sm mr-2"
        checked={isWhisper}
        type="checkbox"
        onChange={(e) => {
          const { checked } = e.target
          setter('isWhisper', checked)
        }}
      />
      <span className="label-text text-sm">悄悄话</span>
    </label>
  )
}

const SyncToRecentlyCheckbox = () => {
  const isLogged = useIsLogged()
  const syncToRecently = useAtomValue(
    useGetCommentBoxAtomValues().syncToRecently,
  )
  const setter = useSetCommentBoxValues()
  const isReply = useUseCommentReply()
  if (!isLogged) return null
  if (isReply) return null
  return (
    <label className="label mx-2 flex items-center">
      <input
        className="checkbox-accent checkbox checkbox-sm mr-2"
        checked={syncToRecently}
        type="checkbox"
        onChange={(e) => {
          const { checked } = e.target
          setter('syncToRecently', checked)
        }}
      />
      <span className="label-text text-sm">同步到碎碎念</span>
    </label>
  )
}

export const CommentBoxActionBar: Component = ({ className }) => {
  const hasCommentText = useCommentBoxHasText()

  return (
    <footer
      className={clsxm(
        'mt-3 flex h-5 w-full min-w-0 items-center justify-between',
        className,
      )}
    >
      <span
        className={clsx(
          'flex-1 select-none text-[10px] text-zinc-500 transition-opacity',
        )}
      >
        <span className="hidden md:inline">
          支持 <b>Markdown</b> 与{' '}
          <MLink href="https://docs.github.com/zh/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax">
            GFM
          </MLink>
        </span>
        <CommentBoxSlotProvider />
      </span>
      <AnimatePresence>
        {hasCommentText && (
          <m.aside
            key="send-button-wrapper"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            className="flex select-none items-center gap-2.5"
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
  const [onClickSend, isPending] = useSendComment()
  return (
    <m.button
      className="flex appearance-none items-center space-x-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      disabled={isPending}
      onClick={onClickSend}
    >
      <TiltedSendIcon className="size-5 text-zinc-800 dark:text-zinc-200" />
      <m.span className="text-sm" layout="size">
        {isPending ? '送信...' : '送信'}
      </m.span>
    </m.button>
  )
}
