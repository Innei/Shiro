import axios from 'axios'
import type { BLUser } from './types/user'

import { appConfig } from '~/app.config'
import { NextServerResponse } from '~/lib/edge-function.server'
import { getQueryClient } from '~/lib/query-client.server'

const headers = {
  referer: `https://link.bilibili.com/p/center/index?visit_id=22ast2mb9zhc`,
  'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Shiro`,
}

export const GET = async () => {
  const liveId = appConfig.module.bilibili.liveId

  const queryClient = getQueryClient()
  const res = await queryClient.fetchQuery({
    queryKey: ['bilibili-live', liveId],
    queryFn: async () => {
      return axios
        .get(
          `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${liveId}&protocol=0,1&format=0,1,2&codec=0,1&qn=0&platform=web&ptype=8&dolby=5`,
          {
            headers,
          },
        )
        .then((res) => res.data)
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
  const userInfo = await axios
    .get(
      `https://api.live.bilibili.com/live_user/v1/UserInfo/get_anchor_in_room?roomid=${liveId}`,
      {
        headers,
      },
    )
    .catch(() => null)

  if (!userInfo?.data) {
    return
  }

  const info = (userInfo.data as BLUser).data.info
  return response.json({ ...info })
}
