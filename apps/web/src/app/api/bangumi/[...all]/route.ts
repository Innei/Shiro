// reverse proxy to bangumi api
//

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { allowedBangumiTypes, typeMap } from '~/lib/bangumi'
import { NextServerResponse } from '~/lib/edge-function.server'

export const runtime = 'edge'
export const revalidate = 86400 // 24 hours
export const GET = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname.split('/').slice(3)
  const query = req.nextUrl.searchParams

  query.delete('all')

  const res = new NextServerResponse()
  const allowedPathLength = 2
  if (
    pathname.length > allowedPathLength ||
    !allowedBangumiTypes.includes(pathname[0])
  ) {
    return res.status(400).send('This request is not allowed')
  }

  const dtype = typeMap[pathname[0] as keyof typeof typeMap]
  const id = pathname[1]
  const url = new URL(`https://api.bgm.tv/v0/${dtype}/${id}`)

  const headers = new Headers()
  headers.set(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko), Shiro',
  )

  const response = await fetch(url, {
    headers,
  })
  const data = await response.json()
  return NextResponse.json(data)
}
