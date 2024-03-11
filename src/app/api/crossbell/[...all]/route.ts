import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { NextServerResponse } from '~/lib/edge-function.server'

const endpoint = 'https://indexer.crossbell.io/v1'
const factory = (method: string) => async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname.split('/').slice(3)

  const res = new NextServerResponse()

  const url = `${endpoint}/${pathname.join('/')}`

  const headers = new Headers()
  headers.set(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko), Shiro',
  )
  headers.set('Authorization', `Bearer ${process.env.CROSSBELL_TOKEN}`)

  if (!process.env.CROSSBELL_TOKEN) {
    return res.status(500).send('CROSSBELL_TOKEN is not set')
  }

  const options: RequestInit = {
    headers,
    method,
  }

  if (method === 'PUT' || method === 'POST') {
    options.body = JSON.stringify(req.body)
  }
  const response = await fetch(url, options)

  const data = await response.json()

  return NextResponse.json(data)
}

export const PUT = factory('PUT')
export const GET = factory('GET')
