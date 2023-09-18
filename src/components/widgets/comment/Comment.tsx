import {
  createContext,
  memo,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { m } from 'framer-motion'
import { atom, useAtomValue } from 'jotai'
import Markdown from 'markdown-to-jsx'
import type { CommentModel } from '@mx-space/api-client'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import type { PropsWithChildren } from 'react'

import { Avatar } from '~/components/ui/avatar'
import { RelativeTime } from '~/components/ui/relative-time'
import { softSpringPreset } from '~/constants/spring'
import { jotaiStore } from '~/lib/store'

import styles from './Comment.module.css'
import { CommentPinButton, OcticonGistSecret } from './CommentPinButton'
import { CommentReplyButton } from './CommentReplyButton'

export const Comment: Component<{
  comment: CommentModel & { new?: boolean }
}> = memo(function Comment(props) {
  const { comment, className } = props
  const elAtom = useMemo(() => atom<HTMLDivElement | null>(null), [])
  // FIXME 兜一下后端给的脏数据
  if (typeof comment === 'string') return null
  const {
    id: cid,
    avatar,
    author,
    text,
    key,
    location,
    isWhispers,
    url,
  } = comment
  const parentId =
    typeof comment.parent === 'string' ? comment.parent : comment.parent?.id
  const authorElement = url ? (
    <a
      href={url}
      className="ml-2 max-w-full flex-shrink-0 break-all"
      target="_blank"
      rel="noreferrer"
    >
      {author}
    </a>
  ) : (
    <span className="ml-2 max-w-full flex-shrink-0 break-all">{author}</span>
  )

  return (
    <>
      <CommentHolderContext.Provider value={elAtom}>
        <m.li
          initial={
            comment['new']
              ? {
                  opacity: 0,
                  scale: 0.93,
                  y: 20,
                }
              : true
          }
          transition={softSpringPreset}
          animate={
            comment['new']
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }
              : void 0
          }
          data-comment-id={cid}
          data-parent-id={parentId}
          className={clsx('relative my-2', className)}
        >
          <div className="group flex w-full items-stretch gap-2">
            <div className="relative flex w-9 shrink-0 self-end">
              <Avatar
                shadow={false}
                imageUrl={avatar}
                alt={`${author}'s avatar`}
                className="h-9 w-9 select-none rounded-full bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800"
                width={24}
                height={24}
              />
            </div>

            {/* Header */}
            <div
              className={clsx(
                'flex flex-1 flex-col',
                'w-full min-w-0 items-start',
              )}
            >
              <span
                className={clsx(
                  'flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200',
                  'relative mb-2 w-full min-w-0 justify-center',
                )}
              >
                <span className="flex flex-grow flex-wrap items-center gap-2">
                  {authorElement}
                  <span className="flex min-w-0 flex-shrink select-none flex-wrap items-center space-x-2 self-end">
                    <span className="inline-flex flex-shrink-0 text-[10px] font-medium opacity-40">
                      <RelativeTime date={comment.created} />
                    </span>
                    <span className="break-all text-[10px] opacity-30">
                      {key}
                    </span>
                    {!!location && (
                      <span className="min-w-0 max-w-full truncate break-all text-[10px] opacity-[0.35]">
                        来自：{location}
                      </span>
                    )}
                    {!!isWhispers && <OcticonGistSecret />}
                  </span>
                </span>

                <span className="flex-shrink-0">
                  <CommentPinButton comment={comment} />
                </span>
              </span>

              {/* Content */}
              <div
                className={clsx(
                  styles['comment__message'],
                  'relative inline-block rounded-xl px-2 py-1 text-zinc-800 dark:text-zinc-200',
                  'rounded-bl-sm bg-zinc-600/5 dark:bg-zinc-500/20',
                  'max-w-[calc(100%-3rem)]',
                )}
              >
                <Markdown
                  options={{
                    disabledTypes,
                    disableParsingRawHTML: true,
                    forceBlock: true,
                  }}
                >
                  {text}
                </Markdown>
                <CommentReplyButton commentId={comment.id} />
              </div>
            </div>
          </div>
        </m.li>

        <CommentBoxHolderProvider />
      </CommentHolderContext.Provider>
      {comment.children && comment.children.length > 0 && (
        <ul className="my-2 space-y-2">
          {comment.children.map((child) => (
            <Comment key={child.id} comment={child} className="ml-9" />
          ))}
        </ul>
      )}
    </>
  )
})

const CommentHolderContext = createContext(atom(null as null | HTMLDivElement))

const CommentBoxHolderProvider = () => {
  const ref = useRef<HTMLDivElement>(null)
  const commentBoxHolderElementAtom = useContext(CommentHolderContext)
  useLayoutEffect(() => {
    jotaiStore.set(commentBoxHolderElementAtom, ref.current)

    return () => {
      jotaiStore.set(commentBoxHolderElementAtom, null)
    }
  }, [commentBoxHolderElementAtom])
  return <div ref={ref} />
}

export const CommentBoxHolderPortal = (props: PropsWithChildren) => {
  const portalElement = useAtomValue(useContext(CommentHolderContext))

  if (!portalElement) return null

  return createPortal(props.children, portalElement)
}

const disabledTypes = [
  'footnote',
  'footnoteReference',

  'image',

  'htmlComment',
  'htmlSelfClosing',
  'htmlBlock',
] as MarkdownToJSX.RuleName[]
