/// <reference lib="webworker" />

import { createStore, get, set } from 'idb-keyval'
import { $fetch } from 'ofetch'
import type { AggregateRoot } from '@mx-space/api-client'

const dbStore = createStore('shiro-worker', 'config')

const sw: ServiceWorkerGlobalScope = self as any
const resources = (self as any).__WB_MANIFEST // this is just to satisfy workbox

const POLL_INTERVAL = 10 * 60 * 1000 // 10 分钟

const config: {
  apiUrl: string | null
  pollInterval: number
  site: AggregateRoot | null
  app: AppConfig | null
} = {
  apiUrl: null,
  pollInterval: POLL_INTERVAL,

  site: null,
  app: null,
}

let lastPoll = Date.now()
async function restoreConfig() {
  // 从 IndexedDB 中恢复配置
  for (const key in config) {
    const value = await get(key, dbStore)
    if (value) {
      ;(config as any)[key] = JSON.parse(value)
    }

    console.debug('Restored config:', key, (config as any)[key])
  }

  lastPoll = (await get('lastPoll', dbStore)) || Date.now()
}

restoreConfig()

sw.addEventListener('message', (event) => {
  console.debug('Received message:', event.data)
  if (!event.data) return

  switch (event.data.type) {
    case 'INIT_CONFIG':
      console.info('Received configuration:', event.data.config)

      Object.assign(config, event.data.config)

      for (const key in config) {
        set(key, JSON.stringify((config as any)[key]), dbStore)
      }
      startPolling()
      break
    default:
      break
  }
})

sw.addEventListener('install', (event) => {
  event.waitUntil(sw.skipWaiting())
})
let isPolling = false

sw.addEventListener('activate', async (event) => {
  event.waitUntil(
    (async (): Promise<any> => {
      await sw.clients.claim()
      console.debug('Service Worker activated')

      startPolling()
    })(),
  )
})

startPolling()

function startPolling() {
  if (isPolling) return
  if (!config.apiUrl) return

  console.debug('Start polling')
  pollAPI()

  isPolling = true
}

// 使用 setTimeout 来实现定时轮询
async function pollAPI() {
  try {
    const response = await $fetch<NotificationResponse>(
      `${config.apiUrl}/activity/recent/notification?from=${lastPoll}`,
    )

    // console.log('API response:', response, config.app, config.site)
    const now = Date.now()
    set('lastPoll', now, dbStore)
    lastPoll = now

    if (response.data.length > 0) {
      const data = response.data[0]
      sw.registration.showNotification(config.site?.seo.title || '新通知', {
        body: `发布了新文章：${data.title}`,
        icon: config.site?.user.avatar,
        data: {
          url:
            data.type === 'posts' ? `/posts/${data.slug}` : `/notes/${data.id}`,
        },
      })
    }
  } catch (error) {
    console.error('Failed to fetch API:', error)
  }
  setTimeout(pollAPI, config.pollInterval)
}

sw.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(
    sw.clients.matchAll({ type: 'window' }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url == '/' && 'focus' in client) {
          return client.focus()
        }
      }
      if (sw.clients.openWindow) {
        return sw.clients.openWindow(event.notification.data.url)
      }
    }),
  )
})

interface NotificationResponse {
  data: DataItem[]
}
interface DataItem {
  title: string
  type: 'posts' | 'notes'
  slug?: string
  id?: number
}
