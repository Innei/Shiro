import { geolocation, ipAddress } from '@vercel/functions'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import {
  REQUEST_GEO,
  REQUEST_HOST,
  REQUEST_IP,
  REQUEST_LOCALE,
  REQUEST_PATHNAME,
  REQUEST_QUERY,
} from './constants/system'
import { defaultLocale, locales } from './i18n/config'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const NEXT_INTL_LOCALE_HEADER = 'X-NEXT-INTL-LOCALE'

// Check if a string looks like a locale code (2-3 lowercase letters)
const localePattern = /^[a-z]{2,3}$/

function isUnsupportedLocale(segment: string): boolean {
  return localePattern.test(segment) && !locales.includes(segment as any)
}

function normalizeLocale(input?: string | null): string | undefined {
  if (!input) return undefined
  const locale = input.toLowerCase()
  const base = locale.split('-')[0]
  if (base && locales.includes(base as any)) return base
  return undefined
}

function getLocaleFromPathname(pathname: string): string | undefined {
  const firstSegment = pathname.split('/').find((segment) => segment.length > 0)
  return normalizeLocale(firstSegment)
}

function getLocaleFromRequest(req: NextRequest, pathname: string): string {
  return (
    getLocaleFromPathname(pathname) ||
    normalizeLocale(req.headers.get(NEXT_INTL_LOCALE_HEADER)) ||
    normalizeLocale(req.cookies.get('NEXT_LOCALE')?.value) ||
    (() => {
      const acceptLanguage = req.headers.get('accept-language')
      if (!acceptLanguage) return
      // e.g. "ja,en-US;q=0.9,en;q=0.8"
      const tags = acceptLanguage
        .split(',')
        .map((part) => part.trim().split(';')[0])
        .filter(Boolean)
      for (const tag of tags) {
        const normalized = normalizeLocale(tag)
        if (normalized) return normalized
      }
      return
    })() ||
    defaultLocale
  )
}

function getLocaleFromIntlResponseHeaders(
  headers: Headers,
): string | undefined {
  // next-intl sets locale as a request header override, which Next.js serializes
  // to response headers using `x-middleware-request-*`.
  return (
    normalizeLocale(
      headers.get(
        `x-middleware-request-${NEXT_INTL_LOCALE_HEADER.toLowerCase()}`,
      ),
    ) ||
    normalizeLocale(
      headers.get(`x-middleware-request-${NEXT_INTL_LOCALE_HEADER}`),
    ) ||
    undefined
  )
}

const shouldSkipIntl = (pathname: string) => {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/feed') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/home-og') ||
    pathname === '/robots.txt' ||
    pathname.includes('.')
  )
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  let geo = geolocation(req)
  const { headers } = req
  let ip = ipAddress(req) ?? headers.get('x-real-ip')
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

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set(REQUEST_PATHNAME, pathname)
  requestHeaders.set(REQUEST_QUERY, search)
  requestHeaders.set(REQUEST_GEO, geo?.country || 'unknown')
  requestHeaders.set(REQUEST_IP, ip || '')
  requestHeaders.set(REQUEST_HOST, headers.get('host') || '')

  const { searchParams } = req.nextUrl

  if (searchParams.has('peek-to')) {
    const peekTo = searchParams.get('peek-to')
    if (peekTo) {
      const clonedUrl = req.nextUrl.clone()
      clonedUrl.pathname = peekTo
      clonedUrl.searchParams.delete('peek-to')
      return NextResponse.redirect(clonedUrl)
    }
  }

  if (!shouldSkipIntl(pathname)) {
    // Check for unsupported locale in path and redirect to default
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0]
    if (firstSegment && isUnsupportedLocale(firstSegment)) {
      // Remove the unsupported locale prefix and redirect
      const newPathname = `/${segments.slice(1).join('/')}`
      const clonedUrl = req.nextUrl.clone()
      clonedUrl.pathname = newPathname || '/'
      return NextResponse.redirect(clonedUrl)
    }

    const intlResponse = intlMiddleware(req)

    // Copy headers from intl response
    if (intlResponse.headers) {
      intlResponse.headers.forEach((value, key) => {
        requestHeaders.set(key, value)
      })
    }

    // Persist resolved locale for server-side fetching (e.g. as `x-lang`)
    requestHeaders.set(
      REQUEST_LOCALE,
      getLocaleFromIntlResponseHeaders(intlResponse.headers) ||
        getLocaleFromRequest(req, pathname),
    )

    // Handle redirects
    if (
      intlResponse.status === 307 ||
      intlResponse.status === 308 ||
      intlResponse.headers.get('location')
    ) {
      return intlResponse
    }

    // Handle rewrites (for as-needed mode with default locale)
    const rewriteHeader = intlResponse.headers.get('x-middleware-rewrite')
    if (rewriteHeader) {
      const rewriteUrl = new URL(rewriteHeader)
      return NextResponse.rewrite(rewriteUrl, {
        request: {
          headers: requestHeaders,
        },
      })
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Routes that skip next-intl still benefit from having a stable locale header.
  requestHeaders.set(REQUEST_LOCALE, getLocaleFromRequest(req, pathname))

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
