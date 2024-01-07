import { memo } from 'react'
import type { CommentModel } from '@mx-space/api-client'

import { PageLoading } from '~/components/layout/dashboard/PageLoading'

import { CommentAuthorCell } from './CommentAuthorCell'
import { CommentContentCell } from './CommentContentCell'
import {
  useCommentDataSource,
  useCommentSelectionKeys,
  useSetCommentSelectionKeys,
} from './CommentContext'

export const CommentDesktopTable = () => {
  const { data, isLoading } = useCommentDataSource()

  if (isLoading) {
    return <PageLoading />
  }

  const flatData = data?.pages.flatMap((page) => page.data)
  return (
    <div className="mt-16 flex flex-col gap-3">
      {flatData?.map((item) => {
        return <MemoCommentItem key={item.id} comment={item} />
      })}
    </div>
  )
}

const CommentItem = ({ comment }: { comment: CommentModel }) => {
  const selectionKeys = useCommentSelectionKeys()
  const setSelectionKeys = useSetCommentSelectionKeys()

  return (
    <div className="grid grid-cols-[40px_300px_auto] gap-8">
      <div className="ml-2 mt-[18px]">
        <input
          checked={selectionKeys.has(comment.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectionKeys((prev) => new Set([...prev, comment.id]))
              return
            }
            setSelectionKeys((prev) => {
              const next = new Set(prev)
              next.delete(comment.id)
              return next
            })
          }}
          type="checkbox"
          className="checkbox-accent checkbox checkbox-md"
        />
      </div>

      <CommentAuthorCell className="mt-0" comment={comment} />
      <CommentContentCell className="mt-0" comment={comment} />
    </div>
  )
}
const MemoCommentItem = memo(CommentItem)
