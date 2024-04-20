import type { BusinessEvents } from '@mx-space/webhook'

export const buildSocketEventType = (type: string) =>
  `ws_event:${type}` as const

export class WsEvent extends Event {
  constructor(
    type: BusinessEvents,
    public data: unknown,
  ) {
    super(buildSocketEventType(type))
  }

  static on(
    type: BusinessEvents,

    cb: (data: unknown) => void,
  ) {
    const _cb = (e: any) => {
      cb(e.data)
    }
    document.addEventListener(buildSocketEventType(type), _cb)

    return () => {
      document.removeEventListener(buildSocketEventType(type), _cb)
    }
  }

  static emit(type: BusinessEvents, data: unknown) {
    document.dispatchEvent(new WsEvent(type, data))
  }
}
