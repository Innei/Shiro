import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'

import { fetchAppUrl } from '~/atoms'
import { useResolveAdminUrl } from '~/atoms/hooks/url'
import { defineRouteConfig } from '~/components/modules/dashboard/utils/helper'
import { FullPageLoading } from '~/components/ui/loading'

export const Component = () => {
  const toAdminUrl = useResolveAdminUrl()
  const router = useRouter()

  useLayoutEffect(() => {
    const adminUrl = toAdminUrl()

    if (adminUrl) {
      location.href = adminUrl
    } else {
      fetchAppUrl().then((urls) => {
        if (urls.adminUrl) {
          location.href = urls.adminUrl
        }
      })
    }
  }, [router, toAdminUrl])
  return <FullPageLoading />
}

export const config = defineRouteConfig({
  title: '完整功能与其他设置',
  icon: <i className="i-mingcute-settings-1-line" />,
  priority: 10e2,
})
