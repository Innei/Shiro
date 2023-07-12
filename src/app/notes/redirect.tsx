'use client'

import { useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'

import { routeBuilder, Routes } from '~/lib/route-builder'

import NoteLoading from './loading'

export default function NodeRedirect({ nid }: { nid: number }) {
  const router = useRouter()
  useLayoutEffect(() => {
    router.push(
      routeBuilder(Routes.Note, {
        id: nid,
      }),
    )
  }, [nid])
  return <NoteLoading />
}
