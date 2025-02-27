import type { Pager } from '@mx-space/api-client'
import Link from 'next/link'
import type { FC } from 'react'

import { MotionButtonBase } from '~/components/ui/button'

const className =
  'rounded-md border-[2px] border-accent/50 px-4 py-2 hover:border-accent text-accent transition-colors'

export const PostPagination: FC<{ pagination: Pager }> = ({ pagination }) => {
  return (
    <section className="mt-4 flex justify-between">
      {pagination.hasPrevPage ? (
        <Link href={`/posts?page=${pagination.currentPage - 1}`}>
          <MotionButtonBase tabIndex={-1} className={className}>
            上一页
          </MotionButtonBase>
        </Link>
      ) : (
        <div />
      )}
      {pagination.hasNextPage && (
        <Link href={`/posts?page=${pagination.currentPage + 1}`}>
          <MotionButtonBase tabIndex={-1} className={className}>
            下一页
          </MotionButtonBase>
        </Link>
      )}
    </section>
  )
}
