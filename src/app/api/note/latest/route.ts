import { NextResponse } from 'next/server'
import type { NoteWrappedPayload } from '@mx-space/api-client'

import { apiClient } from '~/lib/request'

export const revalidate = 60

export const GET = async () => {
  const data = await fetch(apiClient.note.proxy.latest.toString(true), {
    next: {
      revalidate: 30,
    },
  }).then((res) => res.json() as Promise<NoteWrappedPayload>)

  return NextResponse.json({
    nid: data.data.nid,
  })
}
