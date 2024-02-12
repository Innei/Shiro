'use client'

import { useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useResolveAdminUrl } from '~/atoms/hooks'

export default function Page() {
  const toAdminUrl = useResolveAdminUrl()
  const router = useRouter()
  useLayoutEffect(() => {
    window.open(toAdminUrl('#/notes/topic'), '_blank')
    router.back()
  }, [router, toAdminUrl])
  return null
}
