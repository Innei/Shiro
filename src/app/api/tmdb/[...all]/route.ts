// reverse proxy to themoviedb api
//

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { NextServerResponse } from '~/lib/edge-function.server'

export const runtime = 'edge'
export const revalidate = 86400 // 24 hours
export const GET = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname.split('/').slice(3)
  const query = req.nextUrl.searchParams

  query.delete('all')

  const res = new NextServerResponse()
  const allowedTypes = ['tv', 'movie']
  const allowedPathLength = 2
  if (
    pathname.length > allowedPathLength ||
    !allowedTypes.includes(pathname[0])
  ) {
    return res.status(400).send('This request is not allowed')
  }

  const searchString = query.toString()

  const url = `https://api.themoviedb.org/3/${pathname.join('/')}${
    searchString
      ? `?${searchString}&api_key=${process.env.TMDB_API_KEY}`
      : `?api_key=${process.env.TMDB_API_KEY}`
  }`

  const headers = new Headers()
  headers.set(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko), Shiro',
  )
  headers.set('Authorization', `Bearer ${process.env.TMDB_API_KEY}`)

  if (!process.env.TMDB_API_KEY) {
    return res.status(500).send('TMDB_API_KEY is not set')
  }

  const response = await fetch(url, {
    headers,
  })
  const data = await response.json()
  return NextResponse.json(data)
}
