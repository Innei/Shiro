import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// import countries from '~/data/countries.json'

import {
  REQUEST_GEO,
  REQUEST_HOST,
  REQUEST_IP,
  REQUEST_PATHNAME,
  REQUEST_QUERY,
} from './constants/system'

export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  let { geo } = req
  const { headers } = req
  let ip = req.ip ?? headers.get('x-real-ip')
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
  requestHeaders.set(REQUEST_GEO, geo?.country || 'unknown')
  requestHeaders.set(REQUEST_IP, ip || '')
  requestHeaders.set(REQUEST_HOST, headers.get('host') || '')

  const isApi = pathname.startsWith('/api/')

  if (geo && !isApi && process.env.VERCEL_ENV) {
    const country = geo.country
    // const city = geo.city

    // const countryInfo = countries.find((x) => x.cca2 === country)
    // if (countryInfo) {
    // try {
    //   const ipKey = `visitor_ip_${dayjs().format('YYYY-MM-DD')}`
    //   await redis.sadd(ipKey, ip)
    //   const countryInfo = countries.find((x) => x.cca2 === country)
    //   if (countryInfo) {
    //     const flag = countryInfo.flag
    //     await redis.set(kvKeys.currentVisitor, { country, city, flag })
    //   }
    //   await redis.expire(ipKey, 60 * 60 * 24 * 7)
    // } catch {}
    // }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
