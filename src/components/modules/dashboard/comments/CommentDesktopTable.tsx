import type { CommentModel } from '@mx-space/api-client'
import type { FC } from 'react'
import { memo } from 'react'

import { PageLoading } from '~/components/layout/dashboard/PageLoading'

import { Empty } from '../../shared/Empty'
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

  if (!flatData?.length) return <Empty className="grow" />
  return (
    <div className="mt-16 flex flex-col gap-3">
      {flatData?.map((item) => (
        <MemoCommentItem key={item.id} comment={item} />
      ))}
    </div>
  )
}

const CommentCheckBox: FC<{
  id: string
}> = ({ id }) => {
  const selectionKeys = useCommentSelectionKeys()
  const setSelectionKeys = useSetCommentSelectionKeys()

  return (
    <input
      checked={selectionKeys.has(id)}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectionKeys((prev) => new Set([...prev, id]))
          return
        }
        setSelectionKeys((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }}
      type="checkbox"
      className="checkbox-accent checkbox checkbox-md"
    />
  )
}
const CommentItem = ({ comment }: { comment: CommentModel }) => (
  <div className="mx-auto grid w-[100rem] max-w-full grid-cols-[40px_300px_auto] gap-8">
    <div className="ml-2 mt-[18px]">
      <CommentCheckBox id={comment.id} />
    </div>

    <CommentAuthorCell className="mt-0" comment={comment} />
    <CommentContentCell className="mt-0" comment={comment} />
  </div>
)
const MemoCommentItem = memo(CommentItem)
