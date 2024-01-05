'use client'

import { useQueryPager, withQueryPager } from '~/hooks/biz/use-query-pager'

export default withQueryPager(function Page() {
  const [page, size] = useQueryPager()

  return (
    <div>
      <h1>Posts</h1>
      <p>
        page: {page}, size: {size}
      </p>
    </div>
  )
})
