import { API_URL } from '~/constants/env'
import {
  getAggregationData,
  getAppConfig,
} from '~/providers/root/aggregation-data-provider'

import { logger } from './logger'

let isRegistered = false
export const registerPushWorker = async () => {
  if (Notification.permission !== 'granted') {
    await Notification.requestPermission()
  }

  // 如果拒绝了通知权限，直接返回
  if (Notification.permission !== 'granted') {
    return
  }

  if (!('serviceWorker' in navigator)) {
    return
  }

  if (isRegistered) {
    return
  }
  navigator.serviceWorker
    .register('/pusher-sw.js')
    // .then((registration) => {
    //   // 尝试更新 Service Worker
    //   return registration
    //     .update()
    //     .then(() => logger.log('Service Worker update attempted.'))
    //     .then(() => registration)
    // })
    .then(() => {
      // 确保 Service Worker 完全控制页面
      return navigator.serviceWorker.ready
    })
    .then(
      async function (registration) {
        if (!registration.active) {
          return
        }
        registration.active.postMessage({
          type: 'INIT_CONFIG',
          config: {
            apiUrl: API_URL,
            pollInterval: 1000 * 60 * 5,
            site: getAggregationData(),
            app: getAppConfig(),
          },
        })
        logger.log('Service Worker registered.')
        isRegistered = true
      },
      function (err) {
        console.error('ServiceWorker registration failed: ', err)
      },
    )
}
