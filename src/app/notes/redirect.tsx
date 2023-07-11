'use client'

import { useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Paper } from '~/components/layout/container/Paper'
import { Loading } from '~/components/ui/loading'
import { routeBuilder, Routes } from '~/lib/route-builder'

export default function NodeRedirect({ nid }: { nid: number }) {
  const router = useRouter()
  useLayoutEffect(() => {
    router.push(
      routeBuilder(Routes.Note, {
        id: nid,
      }),
    )
  }, [nid])
  return (
    <Paper>
      <Loading useDefaultLoadingText />
    </Paper>
  )
}
