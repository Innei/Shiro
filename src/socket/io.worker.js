// @ts-check
/* eslint-disable no-console */
/* eslint-disable no-undef */
/// <reference lib="webworker" />

importScripts('/static/socket.io.js')

/** @type {import('socket.io-client').Socket | null} */
let ws = null

/**
 *
 * @param {{url: string}} config
 * @returns
 */
function setupIo(config) {
  if (ws) return
  // 使用 socket.io
  console.log('Connecting to ws.io server from', config.url)

  // @ts-ignore
  ws = io(config.url, {
    timeout: 10000,
    reconnectionDelay: 3000,
    autoConnect: false,
    reconnectionAttempts: 3,
    transports: ['websocket'],
  })
  if (!ws) return

  ws.on('disconnect', () => {
    boardcast({
      type: 'disconnect',
    })
  })

  /**
   * @param {any} payload
   */
  ws.on('message', (payload) => {
    console.log('ws', payload)

    boardcast({
      type: 'message',
      payload,
    })
  })

  ws.on('connect', () => {
    console.log('Connected to ws.io server from SharedWorker')

    if (waitingEmitQueue.length > 0) {
      waitingEmitQueue.forEach((payload) => {
        if (!ws) return
        ws.emit('message', payload)
      })
      waitingEmitQueue.length = 0
    }
    boardcast({
      type: 'connect',
      // @ts-expect-error
      payload: ws.id,
    })
  })

  ws.open()
  boardcast({
    type: 'sid',
    payload: ws.id,
  })
}

/** @type {MessagePort[]} */
const ports = []

self.addEventListener('connect', (ev) => {
  /** @type {MessageEvent} */
  // @ts-expect-error
  const event = ev

  const port = event.ports[0]

  ports.push(port)

  port.onmessage = (event) => {
    const { type, payload } = event.data
    console.log('get message from main', event.data)

    switch (type) {
      case 'config':
        setupIo(payload)
        break
      case 'emit':
        if (ws) {
          if (ws.connected) ws.emit('message', payload)
          else waitingEmitQueue.push(payload)
        }
        break
      case 'reconnect':
        if (ws) ws.open()
        break
      case 'init':
        port.postMessage({ type: 'ping' })

        if (ws) {
          if (ws.connected) port.postMessage({ type: 'connect' })
          port.postMessage({ type: 'sid', payload: ws.id })
        }
        break
      default:
        console.log('Unknown message type:', type)
    }
  }

  port.start()
})

/**
 *
 * @param {any} payload
 */
function boardcast(payload) {
  console.log('[ws] boardcast', payload)
  ports.forEach((port) => {
    port.postMessage(payload)
  })
}

/**
 * @type {any[]}
 */
const waitingEmitQueue = []
