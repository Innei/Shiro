'use client'

import { useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'

import { fetchAppUrl, useResolveAdminUrl } from '~/atoms'
import { FullPageLoading } from '~/components/ui/loading'

export default function Page() {
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
