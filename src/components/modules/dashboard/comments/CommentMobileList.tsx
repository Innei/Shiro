import { Divider } from '~/components/ui/divider'
import { AbsoluteCenterSpinner, Spinner } from '~/components/ui/spinner'
import { clsxm } from '~/lib/helper'
import { isUndefined } from '~/lib/lodash'

import { Empty } from '../../shared/Empty'
import { OffsetMainLayout } from '../layouts'
import { CommentAuthorCell } from './CommentAuthorCell'
import { CommentContentCell } from './CommentContentCell'
import { useCommentDataSource } from './CommentContext'

export const CommentMobileList = () => {
  const { isLoading, data } = useCommentDataSource()

  if (isLoading && isUndefined(data)) {
    return (
      <div className="flex grow items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const totalLength =
    data?.pages.reduce((acc, page) => acc + page.data.length, 0) || 0

  if (totalLength === 0) {
    return <Empty className="grow" />
  }

  return (
    <OffsetMainLayout className="relative mt-4">
      {isLoading && <AbsoluteCenterSpinner />}
      <ul
        className={clsxm(
          'flex flex-col duration-200',
          isLoading && 'opacity-80',
        )}
      >
        {data?.pages.map((page, i) =>
          page.data.map((item, j) => {
            const idx = i * page.data.length + j
            return (
              <li key={item.id} className="flex flex-col gap-2">
                <CommentAuthorCell comment={item} />
                <CommentContentCell comment={item} />

                {idx !== totalLength - 1 && <Divider />}
              </li>
            )
          }),
        )}
      </ul>
    </OffsetMainLayout>
  )
}
