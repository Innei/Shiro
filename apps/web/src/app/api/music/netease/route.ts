import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { weapi } from './crypto'

export const POST = async (req: NextRequest) => {
  const requestBody = await req.json()
  const { songId } = requestBody
  const data = {
    c: JSON.stringify([{ id: songId, v: 0 }]),
  }
  const body: any = weapi(data)
  const bodyString = `params=${encodeURIComponent(body.params)}&encSecKey=${encodeURIComponent(body.encSecKey)}`

  const response = await fetch('http://music.163.com/weapi/v3/song/detail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyString,
  })

  return NextResponse.json(await response.json())
}
