'use client'

import { useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Loading } from '~/components/ui/loading'
import { routeBuilder, Routes } from '~/lib/route-builder'

import { Paper } from '../../components/layout/container/Paper'

export const revalidate = 60

export default function Page() {
  const router = useRouter()
  useLayoutEffect(() => {
    ;(async () => {
      const { nid } = await fetch('/api/note/latest', {
        next: {
          revalidate: 60,
        },
      }).then(
        (res) =>
          res.json() as Promise<{
            nid: number
          }>,
      )

      router.push(
        routeBuilder(Routes.Note, {
          id: nid,
        }),
      )
    })()
  }, [])

  return (
    <Paper>
      <Loading useDefaultLoadingText />
    </Paper>
  )
}
