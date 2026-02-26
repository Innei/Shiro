import type { BusinessEvents } from '@mx-space/webhook'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { isDev } from '~/lib/env'

import { articleReadCountHandlers } from './handlers/article-read-count'
import { commentHandlers } from './handlers/comment'
import { noteHandlers } from './handlers/note'
import { pageHandlers } from './handlers/page'
import { postHandlers } from './handlers/post'
import { sayHandlers } from './handlers/say'
import type { EventHandler, EventHandlerContext } from './handlers/types'
import { visitorEvents, visitorHandler } from './handlers/visitor'
import { WsEvent } from './util'

const handlerMap: Record<string, EventHandler> = {
  ...postHandlers,
  ...noteHandlers,
  ...pageHandlers,
  ...sayHandlers,
  ...commentHandlers,
  ...articleReadCountHandlers,
}

for (const event of visitorEvents) {
  handlerMap[event] = visitorHandler
}

export const eventHandler = (
  type: string,
  data: any,
  router: AppRouterInstance,
) => {
  const ctx: EventHandlerContext = { router }
  const handler = handlerMap[type]

  if (handler) {
    handler(data, ctx)
  } else if (isDev) {
    console.info(type, data)
  }

  WsEvent.emit(type as BusinessEvents, data)
}
