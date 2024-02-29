import type { RequestWithJSONBody } from '@mx-space/webhook'
import type { NextRequest } from 'next/server'

import {
  BusinessEvents,
  InvalidSignatureError,
  readDataFromRequest,
} from '@mx-space/webhook'

import { CacheKeyMap } from '~/constants/keys'
import { invalidateCache, invalidateCacheWithPrefix } from '~/lib/cache'
import { NextServerResponse } from '~/lib/edge-function.server'

export const POST = async (nextreq: NextRequest) => {
  const secret = process.env.WEBHOOK_SECRET
  const res = new NextServerResponse()
  if (!secret) return res.status(500).send('WEBHOOK_SECRET is not set')
  const req: RequestWithJSONBody = nextreq.clone() as any
  const headers = {} as Record<string, string>
  for (const [key, value] of req.headers.entries()) {
    headers[key] = value
  }

  try {
    const { type } = await readDataFromRequest({
      req: {
        ...req,
        headers: headers as any,
        body: await req.json(),
      } as any,
      secret,
    })

    switch (type) {
      case 'health_check': {
        return res.status(200).send('OK')
      }
      case BusinessEvents.NOTE_CREATE:
      case BusinessEvents.NOTE_DELETE:
      case BusinessEvents.NOTE_UPDATE: {
        await Promise.all([invalidateCache(CacheKeyMap.AggregateTop)])
        return res.status(200).send('OK')
      }
      case BusinessEvents.POST_CREATE:
      case BusinessEvents.POST_UPDATE:
      case BusinessEvents.POST_DELETE: {
        await Promise.all([
          invalidateCacheWithPrefix(CacheKeyMap.PostList),
          invalidateCache(CacheKeyMap.AggregateTop),
        ])
        return res.status(200).send('OK')
      }
      case BusinessEvents.PAGE_CREATE:
      case BusinessEvents.PAGE_UPDATE:
      case BusinessEvents.SAY_CREATE: {
        await Promise.all([invalidateCache(CacheKeyMap.AggregateTop)])
        return res.status(200).send('OK')
      }

      default: {
        return res.status(200).send('MISS')
      }
    }
  } catch (err) {
    if (err instanceof InvalidSignatureError) {
      return res.status(400).send(err.message)
    } else {
      console.error(err)
      return res
        .status(500)
        .send('An error occurred while processing the request')
    }
  }
}
