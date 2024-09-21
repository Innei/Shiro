import type { CommentModel } from '@mx-space/api-client'
import clsx from 'clsx'
import { m } from 'framer-motion'
import { atom, useAtomValue } from 'jotai'
import type { BuiltInProviderType } from 'next-auth/providers/index'
import type { FC, PropsWithChildren } from 'react'
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'

import { Avatar } from '~/components/ui/avatar'
import { FloatPopover } from '~/components/ui/float-popover'
import { BlockLinkRenderer } from '~/components/ui/markdown/renderers/LinkRenderer'
import { RelativeTime } from '~/components/ui/relative-time'
import {
  getStrategyIconComponent,
  UserAuthStrategyIcon,
} from '~/components/ui/user/UserAuthStrategyIcon'
import { softSpringPreset } from '~/constants/spring'
import { jotaiStore } from '~/lib/store'

import styles from './Comment.module.css'
import { CommentActionButtonGroup } from './CommentActionButtonGroup'
import { CommentMarkdown } from './CommentMarkdown'
import { CommentPinButton, OcticonGistSecret } from './CommentPinButton'
import {
  CommentMarkdownContainerRefContext,
  useCommentById,
  useCommentByIdSelector,
  useCommentMarkdownContainerRef,
  useCommentReader,
} from './CommentProvider'

export const Comment: Component<{
  commentId: string
  className?: string
}> = memo(function Comment(props) {
  const { commentId, className } = props
  const comment = useCommentById(commentId)

  if (!comment) return null
  // FIXME 兜一下后端给的脏数据
  if (typeof comment === 'string') return null
  return <CommentRender comment={comment} className={className} />
})
const CommentRender: Component<{
  comment: CommentModel & { new?: boolean }
}> = (props) => {
  const { comment, className } = props

  const elAtom = useMemo(() => atom<HTMLDivElement | null>(null), [])
  const isSingleLinkContent = useMemo(() => {
    const trimmedContent = comment.text
    if (!trimmedContent) return false
    const isSingleLine = trimmedContent.split('\n').length === 1
    const isURL = URL.canParse(trimmedContent)

    return isSingleLine && isURL
  }, [comment.text])
  const reader = useCommentReader(comment.readerId)

  const {
    id: cid,

    text,
    key,
    location,
    isWhispers,
    url,
    source,
  } = comment

  const avatar = reader?.image || comment.avatar
  const author = reader?.name || comment.author
  const parentId =
    typeof comment.parent === 'string' ? comment.parent : comment.parent?.id
  const authorElement = url ? (
    <a
      href={url}
      className="max-w-full shrink-0 break-all"
      target="_blank"
      rel="noreferrer"
    >
      {author}
    </a>
  ) : (
    <span className="max-w-full shrink-0 break-all">{author}</span>
  )

  const CommentNormalContent = (
    <div
      className={clsx(
        styles['comment__message'],
        'relative inline-block rounded-xl text-zinc-800 dark:text-zinc-200',
        'bg-zinc-600/5 dark:bg-zinc-500/20',
        'max-w-[calc(100%-3rem)]',
        'rounded-tl-sm md:rounded-bl-sm md:rounded-tl-xl',
        'ml-4 px-3 py-2 md:ml-0',
        // 'prose-ol:list-inside prose-ul:list-inside',
      )}
    >
      <CommentMarkdownContainerRefContext>
        <CommentMarkdown>{text}</CommentMarkdown>

        <EditedCommentFooter commentId={comment.id} />
      </CommentMarkdownContainerRefContext>

      <CommentActionButtonGroup commentId={comment.id} />
    </div>
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
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          data-comment-id={cid}
          data-reader-id={comment.readerId}
          data-parent-id={parentId}
          className={clsx('relative my-2', className)}
        >
          <div className="group flex w-full items-stretch gap-4">
            <div
              className={clsx(
                'flex shrink-0 self-end md:relative md:w-9',
                'absolute top-2',
              )}
            >
              <Avatar
                shadow={false}
                imageUrl={avatar}
                alt={`${author}'s avatar`}
                className="size-6 select-none rounded-full bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800 md:size-9"
              />
              {source &&
                !!getStrategyIconComponent(source as BuiltInProviderType) && (
                  <div className="center absolute -right-1.5 bottom-1 flex size-3.5 rounded-full bg-white ring-[1.5px] ring-zinc-200 dark:bg-zinc-800 dark:ring-black">
                    <UserAuthStrategyIcon
                      strategy={source as BuiltInProviderType}
                      className="size-3"
                    />
                  </div>
                )}
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
                  'relative w-full min-w-0 justify-center',
                  'mb-2 pl-7 md:pl-0',
                )}
              >
                <span className="ml-2 flex grow flex-col flex-wrap items-start gap-0.5 md:flex-row md:items-center md:gap-2">
                  {authorElement}
                  <span className="-mt-1 flex min-w-0 shrink select-none flex-wrap items-center space-x-2 md:mt-0 md:self-end">
                    <span className="inline-flex shrink-0 text-[0.71rem] font-medium opacity-40">
                      <RelativeTime date={comment.created} />
                    </span>
                    <span className="break-all text-[0.71rem] opacity-30">
                      {key}
                    </span>
                    {!!location && (
                      <span className="min-w-0 max-w-full truncate break-all text-[0.71rem] opacity-35">
                        来自：{location}
                      </span>
                    )}
                    {!!isWhispers && <OcticonGistSecret />}
                  </span>
                </span>

                <span className="shrink-0">
                  <CommentPinButton comment={comment} />
                </span>
              </span>

              {/* Content */}
              {isSingleLinkContent ? (
                <div className="relative inline-block">
                  <BlockLinkRenderer
                    href={text}
                    accessory={
                      <CommentActionButtonGroup
                        commentId={comment.id}
                        className="bottom-4"
                      />
                    }
                    fallback={CommentNormalContent}
                  />
                </div>
              ) : (
                CommentNormalContent
              )}
            </div>
          </div>
        </m.li>

        <CommentBoxHolderProvider />
      </CommentHolderContext.Provider>
      {comment.children && comment.children.length > 0 && (
        <ul className="my-2 space-y-2">
          {comment.children.map((child) => (
            <Comment key={child.id} commentId={child.id} className="ml-9" />
          ))}
        </ul>
      )}
    </>
  )
}

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

const EditedCommentFooter: FC<{
  commentId: string
}> = ({ commentId }) => {
  const editedAt = useCommentByIdSelector(
    commentId,
    useCallback((comment) => comment?.editedAt, []),
  )
  const ref = useCommentMarkdownContainerRef()

  const lastNode = useMemo(() => {
    if (!ref) return null
    return ref.lastChild
  }, [ref])
  const lastNodeIsParagraph = useMemo(() => {
    if (!lastNode) return false
    return lastNode.nodeName === 'P'
  }, [lastNode])

  if (!editedAt) return null

  const InlineEl = (
    <FloatPopover
      type="tooltip"
      triggerElement={
        <span className="ml-2 text-xs text-zinc-500">(已编辑)</span>
      }
    >
      <div>
        <span>编辑于</span>
        <RelativeTime date={editedAt} />
      </div>
    </FloatPopover>
  )
  if (!lastNodeIsParagraph) return <div className="[&_*]:!ml-0">{InlineEl}</div>

  return createPortal(InlineEl, lastNode as HTMLDivElement)
}
