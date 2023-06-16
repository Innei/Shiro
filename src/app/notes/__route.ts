import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { apiClient } from '~/utils/request'

export const GET = async (request: NextRequest) => {
  const url = request.nextUrl.clone()
  const {
    data: { nid },
  } = await apiClient.note.getLatest()
  url.pathname = `/notes/${nid}`
  return NextResponse.redirect(url)
}
