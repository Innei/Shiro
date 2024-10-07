import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'

import { useResolveAdminUrl } from '~/atoms/hooks/url'
import { defineRouteConfig } from '~/components/modules/dashboard/utils/helper'

export const config = defineRouteConfig({
  title: '话题',
  icon: <i className="i-mingcute-table-2-line" />,
  priority: 3,
})
export function Component() {
  const toAdminUrl = useResolveAdminUrl()
  const router = useRouter()
  useLayoutEffect(() => {
    window.open(toAdminUrl('#/notes/topic'), '_blank')
    router.back()
  }, [router, toAdminUrl])
  return null
}
