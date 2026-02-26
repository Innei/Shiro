import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  const requestBody = await req.json()

  const response = await fetch('https://leetcode.cn/graphql/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  return NextResponse.json(await response.json())
}
