import type { NextRequest } from 'next/server'

import { NextServerResponse } from '~/lib/edge-function.server'
import { getQueryClient } from '~/lib/query-client.server'

const headers = {
  referer: `https://link.bilibili.com/p/center/index?visit_id=22ast2mb9zhc`,
  'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Shiro`,
}

export const runtime = 'edge'

export const revalidate = 3600 // 1 hour

export const GET = async (req: NextRequest) => {
  const query = req.nextUrl.searchParams
  const cid = query.get('cid')
  const lang = query.get('lang') || 'zh'
  if (!cid) {
    return new NextServerResponse().status(400).end()
  }

  const queryClient = getQueryClient()
  const res = await queryClient.fetchQuery({
    queryKey: ['xlog-summary', cid],
    queryFn: async () => {
      return fetch(`https://xlog.app/api/summary?cid=${cid}&lang=${lang}`, {
        headers: new Headers(headers),
      })
        .then((res) => res.json())
        .catch(() => null)
    },
  })

  const response = new NextServerResponse()
  if (!res) {
    return response.status(400).end()
  }

  return response.json({ ...res })
}
