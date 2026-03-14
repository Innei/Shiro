import './Comment.css'

import type { CommentModel } from '@mx-space/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { atom, useAtomValue } from 'jotai'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'
import {
  createContext,
  memo,
  use,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
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
import type { AuthSocialProviders } from '~/lib/authjs'
import { apiClient } from '~/lib/request'
import { jotaiStore } from '~/lib/store'
import { buildCommentsQueryKey } from '~/queries/keys'

import { CommentActionButtonGroup } from './CommentActionButtonGroup'
import { useCommentBoxRefIdValue } from './CommentBox/hooks'
import { CommentMarkdown } from './CommentMarkdown'
import { CommentPinButton, OcticonGistSecret } from './CommentPinButton'
import {
  CommentMarkdownContainerRefContext,
  useCommentById,
  useCommentByIdSelector,
  useCommentMarkdownContainerRef,
  useCommentReader,
} from './CommentProvider'
import {
  type CommentThreadInfiniteData,
  type CommentThreadViewItem,
  mergeThreadRepliesIntoPages,
} from './thread'
import type { CommentAnchor } from './types'

export const Comment: Component<{
  commentId: string
  className?: string
}> = memo(function Comment(props) {
  const { commentId, className } = props
  const comment = useCommentById(commentId)

  if (!comment) return null
  // FIXME 兜一下后端给的脏数据
  if (typeof comment === 'string') return null
  return <CommentRender className={className} comment={comment} />
})
const CommentRender: Component<{
  comment: CommentThreadViewItem
}> = (props) => {
  const { comment, className } = props
  const t = useTranslations('comment')

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
    location,
    isWhispers,
    url,
    source,
  } = comment

  const avatar = reader?.image || comment.avatar
  const author = reader?.name || comment.author
  const parentId = comment.parentCommentId ?? null
  const displayText = comment.isDeleted ? t('deleted_placeholder') : text

  const authorUrl = useMemo(() => {
    if (url) return url
    if (source === 'github' && reader?.handle) {
      return `https://github.com/${reader.handle}`
    }
    return null
  }, [url, source, reader?.handle])

  const authorElement = authorUrl ? (
    <a
      className="max-w-full shrink-0 break-all"
      href={authorUrl}
      rel="noreferrer"
      target="_blank"
    >
      {author}
    </a>
  ) : (
    <span className="max-w-full shrink-0 break-all">{author}</span>
  )

  const { anchor } = comment as CommentModel & { anchor?: CommentAnchor }

  const CommentNormalContent = (
    <div
      className={clsx(
        'comment__message',
        'relative inline-block rounded-xl text-neutral-9',
        'bg-neutral-600/5 dark:bg-neutral-500/20',
        'max-w-[calc(100%-3rem)]',
        'rounded-tl-sm md:rounded-bl-sm md:rounded-tl-xl',
        'ml-4 px-3 py-2 md:ml-0',
      )}
    >
      {anchor?.mode === 'range' && (
        <div className="mb-1.5 border-l-2 border-accent/40 pl-2 text-xs italic text-neutral-400 dark:text-neutral-500">
          {anchor.quote}
        </div>
      )}
      {anchor?.mode === 'block' && (
        <div className="mb-1.5 text-xs text-neutral-400 dark:text-neutral-500">
          <span>
            {t('commented_on_block', {
              text: `${anchor.snapshotText.slice(0, 40)}${anchor.snapshotText.length > 40 ? '…' : ''}`,
            })}
          </span>
        </div>
      )}
      <CommentMarkdownContainerRefContext>
        <CommentMarkdown>{displayText}</CommentMarkdown>

        <EditedCommentFooter commentId={comment.id} />
      </CommentMarkdownContainerRefContext>

      <CommentActionButtonGroup commentId={comment.id} />
    </div>
  )
  return (
    <>
      <CommentHolderContext value={elAtom}>
        <m.li
          className={clsx('relative my-2', className)}
          data-comment-id={cid}
          data-parent-id={parentId}
          data-reader-id={comment.readerId}
          transition={softSpringPreset}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          initial={
            comment['new']
              ? {
                  opacity: 0,
                  scale: 0.93,
                  y: 20,
                }
              : true
          }
        >
          <div className="group flex w-full items-stretch gap-4">
            <div
              className={clsx(
                'flex shrink-0 self-end md:relative md:w-9',
                'absolute top-2',
              )}
            >
              <Avatar
                alt={t('avatar_alt', { author })}
                className="size-6 select-none rounded-full bg-neutral-200 ring-2 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-800 md:size-9"
                imageUrl={avatar}
                shadow={false}
              />
              {source &&
                !!getStrategyIconComponent(source as AuthSocialProviders) && (
                  <div className="center absolute -right-1.5 bottom-1 flex size-3.5 rounded-full bg-neutral-50 ring-[1.5px] ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-950">
                    <UserAuthStrategyIcon
                      className="size-3"
                      strategy={source as AuthSocialProviders}
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
                  'flex items-center gap-2 font-semibold text-neutral-9',
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
                    {!!location && (
                      <span className="min-w-0 max-w-full truncate break-all text-[0.71rem] opacity-35">
                        {t('from_location', { location })}
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
                    fallback={CommentNormalContent}
                    href={text}
                    accessory={
                      <CommentActionButtonGroup
                        className="bottom-4"
                        commentId={comment.id}
                      />
                    }
                  />
                </div>
              ) : (
                CommentNormalContent
              )}
            </div>
          </div>
        </m.li>

        <CommentBoxHolderProvider />
      </CommentHolderContext>
      {comment.replyWindow?.hasHidden && (
        <LoadMoreRepliesButton comment={comment} />
      )}
      {comment.children.length > 0 && (
        <ul className="my-2 space-y-2">
          {comment.children.map((child) => (
            <Comment className="ml-9" commentId={child.id} key={child.id} />
          ))}
        </ul>
      )}
    </>
  )
}

const LoadMoreRepliesButton: FC<{
  comment: CommentThreadViewItem
}> = ({ comment }) => {
  const t = useTranslations('comment')
  const queryClient = useQueryClient()
  const refId = useCommentBoxRefIdValue()
  const [remaining, setRemaining] = useState(
    comment.replyWindow?.hiddenCount ?? 0,
  )

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      return apiClient.comment.getThreadReplies(comment.id, {
        cursor: comment.replyWindow?.nextCursor,
        size: 10,
      })
    },
    onSuccess: (result) => {
      const replyWindow = {
        total:
          comment.replyWindow?.total ??
          comment.replyCount ??
          result.replies.length,
        returned: (comment.replies?.length ?? 0) + result.replies.length,
        threshold: comment.replyWindow?.threshold ?? 20,
        hasHidden: !result.done,
        hiddenCount: result.remaining,
        nextCursor: result.nextCursor,
      }

      queryClient.setQueryData<CommentThreadInfiniteData>(
        buildCommentsQueryKey(refId),
        (oldData) => {
          if (!oldData) return oldData
          return mergeThreadRepliesIntoPages(oldData, {
            rootCommentId: comment.id,
            replies: result.replies,
            replyWindow,
          })
        },
      )
      setRemaining(result.remaining)
    },
  })

  if (!comment.replyWindow?.hasHidden) return null

  return (
    <div className="ml-13 mt-2">
      <button
        className="cursor-pointer rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-200"
        disabled={isPending}
        type="button"
        onClick={() => mutateAsync()}
      >
        {isPending
          ? t('loading_more_replies')
          : t('load_more_replies', {
              count: remaining || comment.replyWindow.hiddenCount,
            })}
      </button>
    </div>
  )
}

const CommentHolderContext = createContext(atom(null as null | HTMLDivElement))

const CommentBoxHolderProvider = () => {
  const ref = useRef<HTMLDivElement>(null)
  const commentBoxHolderElementAtom = use(CommentHolderContext)
  useLayoutEffect(() => {
    jotaiStore.set(commentBoxHolderElementAtom, ref.current)

    return () => {
      jotaiStore.set(commentBoxHolderElementAtom, null)
    }
  }, [commentBoxHolderElementAtom])
  return <div ref={ref} />
}

export const CommentBoxHolderPortal = (props: PropsWithChildren) => {
  const portalElement = useAtomValue(use(CommentHolderContext))

  if (!portalElement) return null

  return createPortal(props.children, portalElement)
}

const EditedCommentFooter: FC<{
  commentId: string
}> = ({ commentId }) => {
  const t = useTranslations('common')
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
        <span className="ml-2 text-xs text-neutral-500">{t('edited')}</span>
      }
    >
      <div>
        <span>{t('edited_at')}</span> <RelativeTime date={editedAt} />
      </div>
    </FloatPopover>
  )
  if (!lastNodeIsParagraph) return <div className="[&_*]:!ml-0">{InlineEl}</div>

  return createPortal(InlineEl, lastNode as HTMLDivElement)
}
