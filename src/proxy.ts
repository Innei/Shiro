import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  REQUEST_GEO,
  REQUEST_HOST,
  REQUEST_IP,
  REQUEST_PATHNAME,
  REQUEST_QUERY,
} from './constants/system'

export default async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  let geo = (req as any).geo as any
  const { headers } = req
  let ip = ((req as any).ip as string | undefined) ?? headers.get('x-real-ip')
  const forwardedFor = headers.get('x-forwarded-for')
  if (!ip && forwardedFor) {
    ip = forwardedFor.split(',').at(0) ?? ''
  }
  const cfGeo = headers.get('cf-ipcountry')
  if (cfGeo && !geo) {
    geo = {
      country: cfGeo,
      city: headers.get('cf-ipcity') ?? '',
      latitude: headers.get('cf-iplatitude') ?? '',
      longitude: headers.get('cf-iplongitude') ?? '',
      region: headers.get('cf-region') ?? '',
    }
  }

  // https://github.com/vercel/next.js/issues/46618#issuecomment-1450416633
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set(REQUEST_PATHNAME, pathname)
  requestHeaders.set(REQUEST_QUERY, search)
  requestHeaders.set(REQUEST_GEO, geo?.country || 'unknown')
  requestHeaders.set(REQUEST_IP, ip || '')
  requestHeaders.set(REQUEST_HOST, headers.get('host') || '')

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)',
  ],
}
