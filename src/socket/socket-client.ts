import { io } from 'socket.io-client'
import type { EventTypes, SocketEmitEnum } from '~/types/events'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { Socket } from 'socket.io-client'

import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'

import { getSocketWebSessionId } from '~/atoms/hooks'
import { setSocketIsConnect } from '~/atoms/socket'
import { GATEWAY_URL } from '~/constants/env'
import { SocketConnectedEvent, SocketDisconnectedEvent } from '~/events'
import { isDev } from '~/lib/env'

import { eventHandler } from './handler'

class SocketClient {
  public socket!: Socket

  // @ts-expect-error
  private router: AppRouterInstance

  constructor() {
    const gatewayUrlWithoutTrailingSlash = GATEWAY_URL.replace(/\/$/, '')

    this.socket = io(`${gatewayUrlWithoutTrailingSlash}/web`, {
      timeout: 10000,
      reconnectionDelay: 3000,
      autoConnect: false,
      reconnectionAttempts: 3,
      transports: ['websocket'],

      query: {
        socket_session_id: getSocketWebSessionId(),
      },
    })
  }

  setRouter(router: AppRouterInstance) {
    this.router = router
  }
  initIO() {
    if (!this.socket) {
      return
    }

    this.socket.on('connect', () => {
      window.dispatchEvent(new SocketConnectedEvent())
      setSocketIsConnect(true)

      this.waitingEmitQueue.forEach((cb) => {
        cb(this.socket)
      })
      this.waitingEmitQueue = []
    })

    this.socket.on('disconnect', () => {
      window.dispatchEvent(new SocketDisconnectedEvent())
      setSocketIsConnect(false)
    })

    this.socket.close()
    this.socket.open()
    setSocketIsConnect(this.socket.connected)
    this.socket.on(
      'message',
      (payload: string | Record<'type' | 'data', any>) => {
        if (typeof payload !== 'string') {
          return this.handleEvent(payload.type, camelcaseKeys(payload.data))
        }
        const { data, type } = JSON.parse(payload) as {
          data: any
          type: EventTypes
        }
        this.handleEvent(type, camelcaseKeys(data))
      },
    )
  }
  reconnect() {
    this.socket.open()
  }
  handleEvent(type: EventTypes, data: any) {
    if (isDev) {
      console.log(data)
    }

    window.dispatchEvent(new CustomEvent(type, { detail: data }))

    eventHandler(type, data, this.router)
  }

  waitingEmitQueue: Array<(socket: typeof this.socket) => any> = []
  emit(event: SocketEmitEnum, payload: any) {
    const handler = (socket: typeof this.socket, cb: (payload: any) => any) => {
      socket.emit('message', { type: event, payload }, (payload: any) => {
        cb(payload)
      })
    }
    return new Promise((resolve) => {
      if (this.socket && this.socket.connected) {
        handler(this.socket, resolve)
      } else {
        this.waitingEmitQueue.push((socket) => {
          handler(socket, resolve)
        })
      }
    })
  }

  static shared = new SocketClient()
}

export const socketClient = SocketClient.shared
export type TSocketClient = SocketClient
