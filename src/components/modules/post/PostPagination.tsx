import Link from 'next/link'
import type { Pager } from '@mx-space/api-client'
import type { FC } from 'react'

import { MotionButtonBase } from '~/components/ui/button'

const className =
  'rounded-md border-[2px] border-accent/50 px-4 py-2 hover:border-accent text-accent transition-colors'

export const PostPagination: FC<{ pagination: Pager }> = ({ pagination }) => {
  return (
    <section className="mt-4 flex justify-between">
      {pagination.hasPrevPage ? (
        <MotionButtonBase tabIndex={-1} className={className}>
          <Link href={`/posts?page=${pagination.currentPage - 1}`}>上一页</Link>
        </MotionButtonBase>
      ) : (
        <div />
      )}
      {pagination.hasNextPage && (
        <MotionButtonBase tabIndex={-1} className={className}>
          <Link href={`/posts?page=${pagination.currentPage + 1}`}>下一页</Link>
        </MotionButtonBase>
      )}
    </section>
  )
}
