'use client'

import { useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'

import { routeBuilder, Routes } from '~/lib/route-builder'

import FullPageLoading from '../friends/loading'

export default function NodeRedirect({ nid }: { nid: number }) {
  const router = useRouter()
  useLayoutEffect(() => {
    router.replace(
      routeBuilder(Routes.Note, {
        id: nid,
      }),
    )
  }, [nid])
  return <FullPageLoading />
}
