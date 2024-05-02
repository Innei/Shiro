import { isDev } from '~/lib/env'

const isLoadScriptMap: Record<string, 'loading' | 'loaded'> = {}
const loadingQueueMap: Record<string, [Function, Function][]> = {}
export function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    const status = isLoadScriptMap[url]
    if (status === 'loaded') {
      return resolve(null)
    } else if (status === 'loading') {
      loadingQueueMap[url] = !loadingQueueMap[url]
        ? [[resolve, reject]]
        : [...loadingQueueMap[url], [resolve, reject]]
      return
    }

    const script = document.createElement('script')
    script.src = url
    script.crossOrigin = 'anonymous'

    isLoadScriptMap[url] = 'loading'
    script.onload = function () {
      isLoadScriptMap[url] = 'loaded'
      resolve(null)
      if (loadingQueueMap[url]) {
        loadingQueueMap[url].forEach(([resolve]) => {
          resolve(null)
        })
        delete loadingQueueMap[url]
      }
    }

    if (isDev) {
      console.info('load script: ', url)
    }

    script.onerror = function (e) {
      // this.onload = null here is necessary
      // because even IE9 works not like others
      this.onerror = this.onload = null
      delete isLoadScriptMap[url]
      loadingQueueMap[url].forEach(([, reject]) => {
        reject(e)
      })
      delete loadingQueueMap[url]
      reject(e)
    }

    document.head.appendChild(script)
  })
}

const cssMap = new Map<string, HTMLLinkElement>()

export function loadStyleSheet(href: string) {
  if (cssMap.has(href)) {
    const $link = cssMap.get(href)!
    return {
      $link,
      remove: () => {
        $link.parentNode && $link.parentNode.removeChild($link)
        cssMap.delete(href)
      },
    }
  }
  const $link = document.createElement('link')
  $link.href = href
  $link.rel = 'stylesheet'
  $link.type = 'text/css'
  $link.crossOrigin = 'anonymous'
  cssMap.set(href, $link)

  $link.onerror = () => {
    $link.onerror = null
    cssMap.delete(href)
  }

  document.head.appendChild($link)

  return {
    remove: () => {
      $link.parentNode && $link.parentNode.removeChild($link)
      cssMap.delete(href)
    },
    $link,
  }
}

export function appendStyle(style: string) {
  let $style: HTMLStyleElement | null = document.createElement('style')
  $style.innerHTML = style
  document.head.appendChild($style)
  return {
    remove: () => {
      if (!$style) return
      $style.parentNode && $style.parentNode.removeChild($style)
      $style.remove()
      $style = null
    },
  }
}
