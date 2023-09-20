import type { NextRequest } from 'next/server'
import type { BLUser } from './types/user'

import { NextServerResponse } from '~/lib/edge-function.server'
import { getQueryClient } from '~/lib/query-client.server'

const headers = {
  referer: `https://live.bilibili.com/`,
  'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Shiro`,
}

const requestHeader = new Headers()

for (const [key, value] of Object.entries(headers)) {
  requestHeader.set(key, value)
}
export const runtime = 'edge'

export const revalidate = 10

export const GET = async (req: NextRequest): Promise<Response> => {
  const liveId = req.nextUrl.searchParams.get('liveId')
  if (!liveId) {
    return new NextServerResponse().status(400).end()
  }
  const queryClient = getQueryClient()
  const res = await queryClient.fetchQuery({
    queryKey: ['bilibili-live', liveId],
    queryFn: async () => {
      return fetch(
        `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${liveId}&protocol=0,1&format=0,1,2&codec=0,1&qn=0&platform=web&ptype=8&dolby=5`,
        {
          headers: requestHeader,
        },
      )
        .then((res) => res.json())
        .catch(() => null)
    },
  })

  const response = new NextServerResponse()

  if (!res?.data) {
    return response.end()
  }

  if (!res?.data?.playurl_info) {
    return response.end()
  }
  const userInfo = await fetch(
    `https://api.live.bilibili.com/live_user/v1/UserInfo/get_anchor_in_room?roomid=${liveId}`,
    {
      headers: requestHeader,
    },
  )
    .then((res) => res.json())
    .catch(() => null)

  if (!userInfo) {
    return response.end()
  }

  const info = (userInfo as BLUser).data.info
  return response.json({ ...info })
}
