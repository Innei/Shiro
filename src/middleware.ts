import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { REQUEST_PATHNAME, REQUEST_QUERY } from './constants/system'

export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // console.debug(`${req.method} ${req.nextUrl.pathname}${req.nextUrl.search}`)

  if (
    pathname.startsWith('/api/') ||
    pathname.match(/^\/(workbox|worker|fallback)-\w+\.js(\.map)?$/) ||
    pathname === '/sw.js' ||
    pathname === '/sw.js.map'
  ) {
    return NextResponse.next()
  }

  // https://github.com/vercel/next.js/issues/46618#issuecomment-1450416633
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set(REQUEST_PATHNAME, pathname)
  requestHeaders.set(REQUEST_QUERY, search)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
