import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'

import { useResolveAdminUrl } from '~/atoms/hooks/url'
import { defineRouteConfig } from '~/components/modules/dashboard/utils/helper'

export const config = defineRouteConfig({
  priority: 3,
  title: '分类',
  icon: <i className="i-mingcute-cat-line" />,
})
export function Component() {
  const toAdminUrl = useResolveAdminUrl()
  const router = useRouter()
  useLayoutEffect(() => {
    window.open(toAdminUrl('#/posts/category'), '_blank')
    router.back()
  }, [router, toAdminUrl])
  return null
}
