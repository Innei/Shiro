'use client'

import { useLayoutEffect } from 'foxact/use-isomorphic-layout-effect'

import { TrackerAction } from '~/constants/tracker'

function isSupportedBrowser() {
  const ua = navigator.userAgent
  const browserRegex = /(?:Chrome|Edg|Firefox|Opera|Safari)\/(\d+)/
  const safariRegex = /Version\/(\d+) Safari/ // Safari 浏览器的版本号不同

  // 检测 Safari
  if (ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Edg')) {
    const match = ua.match(safariRegex)
    return match && parseInt(match[1], 10) >= 16
  }

  const match = ua.match(browserRegex)
  if (!match) return false

  const version = parseInt(match[1], 10)
  switch (true) {
    case ua.includes('Chrome') && !ua.includes('Edg'):
      return version >= 110
    case ua.includes('Edg'):
      return version >= 110
    case ua.includes('Firefox'):
      return version >= 113
    case ua.includes('Opera'):
      return version >= 102
    default:
      return false
  }
}

export const BrowserSupport = () => {
  useLayoutEffect(() => {
    if (!isSupportedBrowser()) {
      document.dispatchEvent(
        new CustomEvent('impression', {
          detail: {
            action: TrackerAction.Interaction,
            label: 'Unsupported Browser',
          },
        }),
      )
      alert('您的浏览器版本过低，请升级浏览器')
    }
  }, [])
  return null
}
