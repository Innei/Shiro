import { memo } from 'react'
import clsx from 'clsx'
import Markdown from 'markdown-to-jsx'
import Image from 'next/image'
import type { CommentModel } from '@mx-space/api-client'
import type { MarkdownToJSX } from 'markdown-to-jsx'

import { RelativeTime } from '~/components/ui/relative-time'

import styles from './Comment.module.css'

export const Comment: Component<{
  comment: CommentModel
  showLine?: boolean
}> = memo((props) => {
  const { comment, className, showLine } = props
  const { id: cid, avatar, author, text } = comment
  const parentId =
    typeof comment.parent === 'string' ? comment.parent : comment.parent?.id
  return (
    <>
      <li
        data-comment-id={cid}
        data-parent-id={parentId}
        className={clsx('relative', className)}
      >
        <div className="flex w-full items-stretch gap-2">
          <div className="flex w-9 shrink-0 items-end">
            <Image
              src={avatar}
              alt=""
              className="h-9 w-9 select-none rounded-full bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800 "
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
              <Markdown
                // value={`${
                //   comment.parent
                //     ? `@${
                //         commentIdMap.get(comment.parent as any as string)?.id ??
                //         (comment.parent as any as CommentModel)?.id ??
                //         ''
                //       } `
                //     : ''
                // }${comment.text}`}
                forceBlock
                disableParsingRawHTML
                disabledTypes={disableTypes}
              >
                {text}
              </Markdown>
            </div>
          </div>
        </div>

        {showLine && (
          <span
            className="absolute left-5 top-0 -ml-px h-[calc(100%-3rem)] w-0.5 rounded bg-zinc-200 dark:bg-neutral-700"
            aria-hidden="true"
          />
        )}
      </li>
      {comment.children &&
        comment.children.length > 0 &&
        comment.children.map((child) => (
          <Comment key={child.id} comment={child} className="ml-9" />
        ))}
    </>
  )
})

const disableTypes = [
  'heading',
  'blockQuote',
  'footnote',
  'table',
  'tableSeparator',
  'gfmTask',
  'headingSetext',
  'footnoteReference',
  'htmlSelfClosing',
] as MarkdownToJSX.RuleName[]
