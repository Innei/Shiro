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
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.2535.67',
      Referer: 'https://music.163.com/',
    },
    body: bodyString,
  })

  return NextResponse.json(await response.json())
}
