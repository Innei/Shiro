'use client'

import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'

import { fetchAppUrl } from '~/atoms'
import { useResolveAdminUrl } from '~/atoms/hooks'
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
