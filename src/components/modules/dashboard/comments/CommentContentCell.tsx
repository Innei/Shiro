import { useContext, useMemo } from 'react'
import type { CommentModel } from '@mx-space/api-client'

import { CollectionRefTypes } from '@mx-space/api-client'

import { MotionButtonBase } from '~/components/ui/button'
import { RelativeTime } from '~/components/ui/relative-time'
import { EllipsisHorizontalTextWithTooltip } from '~/components/ui/typography'
import { clsxm } from '~/lib/helper'
import { apiClient } from '~/lib/request'

import { CommentAction } from './CommentAction'
import { CommentDataContext } from './CommentContext'
import { CommentUrlRender } from './UrlRender'

export const CommentContentCell: Component<{ comment: CommentModel }> = (
  props,
) => {
  const { comment, className } = props
  const {
    created,
    refType,
    text,
    id,
    parent: parentComment,

    isWhispers,
  } = comment
  const ctx = useContext(CommentDataContext)
  const ref = ctx.refModelMap.get(id)

  const TitleEl = useMemo(() => {
    if (!ref) return <span className="text-foreground/60">已删除</span>
    if (refType === CollectionRefTypes.Recently)
      return `${ref.text.slice(0, 20)}...`
    return (
      <MotionButtonBase
        onClick={async () => {
          const url = await apiClient.proxy.helper('url-builder')(ref.id).get<{
            data: string
          }>()
          window.open(url?.data, '_blank')
        }}
      >
        <EllipsisHorizontalTextWithTooltip wrapperClassName="text-accent inline-block !w-auto max-w-full">
          {ref.title}
        </EllipsisHorizontalTextWithTooltip>
      </MotionButtonBase>
    )
  }, [ref, refType])
  return (
    <div className={clsxm('flex flex-col gap-2 py-2 text-sm', className)}>
      <div className="flex gap-2 whitespace-nowrap text-sm">
        <RelativeTime date={created} /> 于 {TitleEl} {isWhispers && '悄悄说'}
      </div>

      <p className="break-words">{text}</p>

      {parentComment && typeof parentComment !== 'string' && (
        <div className="relative mt-2 break-words">
          <blockquote className="ml-3 pl-3 before:absolute before:bottom-0 before:left-[3px] before:top-0 before:h-full before:w-[3px] before:rounded-lg before:bg-accent before:content-['']">
            <div>
              <CommentUrlRender
                author={parentComment.author}
                url={parentComment.url}
              />{' '}
              在 <RelativeTime date={parentComment.created} /> 说：
            </div>
            <p className="mt-2">{parentComment.text}</p>
          </blockquote>
        </div>
      )}

      <CommentAction comment={props.comment} />
    </div>
  )
}
