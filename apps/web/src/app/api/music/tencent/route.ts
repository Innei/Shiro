import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  const requestBody = await req.json()
  const { songId } = requestBody

  const response = await fetch(
    `https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?songmid=${songId}&platform=yqq&format=json`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  return NextResponse.json(await response.json())
}
