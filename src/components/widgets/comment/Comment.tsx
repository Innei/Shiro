import clsx from 'clsx'
import Markdown from 'markdown-to-jsx'
import Image from 'next/image'
import type { CommentModel } from '@mx-space/api-client'

import { RelativeTime } from '~/components/ui/relative-time'

import styles from './Comment.module.css'

export const Comment: Component<{ comment: CommentModel }> = (props) => {
  const { comment, className } = props
  const { id: cid, avatar, author, text } = comment
  const parentId =
    typeof comment.parent === 'string' ? comment.parent : comment.parent?.id
  return (
    <li data-comment-id={cid} data-parent-id={parentId} className={className}>
      <div className="flex w-full items-stretch gap-2">
        <div className="flex w-9 shrink-0 items-end">
          <Image
            src={avatar}
            alt=""
            className="h-9 w-9 select-none rounded-full"
            width={24}
            height={24}
            unoptimized
          />
        </div>
        <div className={clsx('flex flex-1 flex-col', 'items-start')}>
          <span
            className={clsx(
              'flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200',
              'mb-2',
            )}
          >
            <span className="ml-2">{author}</span>
            <span className="inline-flex select-none text-[10px] font-medium opacity-40">
              <RelativeTime date={comment.created} />
            </span>
          </span>

          <div
            className={clsx(
              styles['comment__message'],
              'group relative inline-block rounded-xl px-2 py-1 text-zinc-800 dark:text-zinc-200',
              'rounded-bl-sm bg-zinc-600/5 dark:bg-zinc-500/20',
            )}
          >
            <Markdown>{text}</Markdown>
          </div>
        </div>
      </div>
    </li>
  )
}
