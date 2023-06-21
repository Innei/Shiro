import dayjs from 'dayjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import countries from '~/data/countries.json'
import { redis } from '~/lib/redis.server'

import {
  REQUEST_GEO,
  REQUEST_PATHNAME,
  REQUEST_QUERY,
} from './constants/system'

export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const { geo, ip } = req

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

  const isApi = pathname.startsWith('/api/')

  if (geo && !isApi && process.env.VERCEL_ENV) {
    const country = geo.country
    const city = geo.city

    const countryInfo = countries.find((x) => x.cca2 === country)
    if (countryInfo) {
      const flag = countryInfo.flag
      requestHeaders.set(REQUEST_GEO, `${country}-${city}-${flag}`)
      await redis.hset('visitor_geo', {
        [new Date().toISOString()]: `${country}-${city}-${flag}`,
      })
      await redis.sadd(`visitor_ip_${dayjs().format('MM-DD')}`, ip)
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
