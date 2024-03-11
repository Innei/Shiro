// reverse proxy to github api
//

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'
export const revalidate = 86400 // 24 hours
export const GET = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname.split('/').slice(3)
  const query = req.nextUrl.searchParams

  query.delete('all')

  const searchString = query.toString()

  const url = `https://api.github.com/${pathname.join('/')}${
    searchString ? `?${searchString}` : ''
  }`

  const headers = new Headers()
  headers.set(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko), Shiro',
  )
  headers.set('Authorization', `Bearer ${process.env.GH_TOKEN}`)

  if (!process.env.GH_TOKEN) {
    return NextResponse.error()
  }

  const response = await fetch(url, {
    headers,
  })
  const data = await response.json()
  return NextResponse.json(data)
}
