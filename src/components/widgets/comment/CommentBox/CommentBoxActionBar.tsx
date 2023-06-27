'use client'

import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

import { TiltedSendIcon } from '~/components/icons/TiltedSendIcon'
import { FloatPopover } from '~/components/ui/float-popover'
import { MLink } from '~/components/ui/markdown/renderers/link'
import { clsxm } from '~/utils/helper'

import {
  useCommentBoxHasText,
  useCommentBoxTextIsOversize,
  useCommentBoxTextValue,
} from './CommentBoxProvider'
import { MAX_COMMENT_TEXT_LENGTH } from './constants'

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
export const CommentBoxActionBar: Component = ({ className }) => {
  const hasCommentText = useCommentBoxHasText()

  return (
    <footer
      className={clsxm(
        'mt-3 flex h-5 w-full items-center justify-between',
        className,
      )}
    >
      <span
        className={clsx(
          'flex-1 select-none text-[10px] text-zinc-500 transition-opacity',
          hasCommentText ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        支持 <b>Markdown</b> 与{' '}
        <MLink href="https://docs.github.com/zh/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax">
          GFM
        </MLink>
      </span>
      <AnimatePresence>
        {hasCommentText && (
          <motion.aside
            key="send-button-wrapper"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            className="flex select-none items-center gap-2.5"
          >
            <TextLengthIndicator />

            <FloatPopover type="tooltip" TriggerComponent={SubmitButton}>
              发送
            </FloatPopover>
          </motion.aside>
        )}
      </AnimatePresence>
    </footer>
  )
}

const SubmitButton = () => {
  const isLoading = false
  const onClickSend = () => {}
  return (
    <motion.button
      className="appearance-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      disabled={isLoading}
      onClick={onClickSend}
    >
      <TiltedSendIcon className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />
    </motion.button>
  )
}
