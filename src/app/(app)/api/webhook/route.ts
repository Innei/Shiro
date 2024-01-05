import { revalidateTag } from 'next/cache'
import type { RequestWithJSONBody } from '@mx-space/webhook'
import type { NextRequest } from 'next/server'

import {
  BusinessEvents,
  InvalidSignatureError,
  readDataFromRequest,
} from '@mx-space/webhook'

import { NextServerResponse } from '~/lib/edge-function.server'

// export const runtime = 'edge'
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
      case 'health-check': {
        return res.status(200).send('OK')
      }
      case BusinessEvents.NOTE_CREATE:
      case BusinessEvents.NOTE_DELETE:
      case BusinessEvents.NOTE_UPDATE: {
        revalidateTag('note')
        return res.status(200).send('OK')
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
