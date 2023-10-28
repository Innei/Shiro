// 添加监听器 / AddEventListener
const ServiceWoker_Version = '23.10.28-rc.1'
const CACHE_NAME = 'TNXG_BLOG_CACHE'
let cachelist = []
self.addEventListener('install', async function (installEvent) {
  self.skipWaiting()
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('[TNXG_SW]Opened cache')
      return cache.addAll(cachelist)
    }),
  )
})
self.addEventListener('fetch', async (event) => {
  event.respondWith(handle(event.request))
})
const handle = async (req) => {
  const urlStr = req.url
  const urlObj = new URL(urlStr)
  const urlPath = urlObj.pathname
  const domain = urlObj.hostname

  self.db = {
    read: (key, config) => {
      if (!config) {
        config = { type: 'text' }
      }
      return new Promise((resolve, reject) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache
            .match(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`))
            .then(function (res) {
              if (!res) resolve(null)
              res.text().then((text) => resolve(text))
            })
            .catch(() => {
              resolve(null)
            })
        })
      })
    },
    write: (key, value) => {
      return new Promise((resolve, reject) => {
        caches
          .open(CACHE_NAME)
          .then(function (cache) {
            cache.put(
              new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`),
              new Response(value),
            )
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
  }
  // 对数组内所有地址进行请求，返回第一个成功的请求结果并打断其他请求
  const 并发请求 = async (urls, url) => {
    let controller = new AbortController()
    const PauseProgress = async (res) => {
      return new Response(await res.arrayBuffer(), {
        status: res.status,
        headers: res.headers,
      })
    }
    if (!Promise.any) {
      Promise.any = function (promises) {
        return new Promise((resolve, reject) => {
          promises = Array.isArray(promises) ? promises : []
          let len = promises.length
          let errs = []
          if (len === 0)
            return reject(new AggregateError('All promises were rejected'))
          promises.forEach((promise) => {
            promise.then(
              (value) => {
                resolve(value)
              },
              (err) => {
                len--
                errs.push(err)
                if (len === 0) {
                  reject(new AggregateError(errs))
                }
              },
            )
          })
        })
      }
    }
    return Promise.any(
      urls.map((urls) => {
        return new Promise((resolve, reject) => {
          fetch(urls, {
            signal: controller.signal,
          })
            .then(PauseProgress)
            .then((res) => {
              if (res.status == 200 || res.status == 304 || res.status == 404) {
                controller.abort()
                resolve(res)
              } else {
                reject(res)
              }
            })
            .catch((e) => reject(e))
        })
      }),
    )
  }
  // 检查是否是 tnxg.top 域名，否则返回警告
  self.addEventListener('message', (event) => {
    const currentURL = event.data
    console.log('[TNXG_SW]检测到消息：' + currentURL)
    if (currentURL !== 'tnxg.top') {
      return new Response("Access denied. Only 'tnxg.top' is allowed.", {
        status: 403,
        headers: { 'Content-Type': 'text/plain' },
      })
    }
  })

  // 主站api函数
  // 拦截所有路径为域名/sw-req/的请求
  if (req.url.includes('/sw-req/')) {
    console.log('[TNXG_SW]检测到SW请求：' + req.url)
    let res = new Response('{"code":200,"msg":"TNXG_SW"}', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // 拦截所有路径为域名/api?getip的请求
    if (req.url.includes('/api?getip')) {
      return fetch('https://api.ip.sb/geoip')
    }

    if (req.url.includes('/api?version')) {
      let res = new Response(
        `{"code":200,"msg":"TNXG_SW,"version":"${ServiceWoker_Version}"}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      return res
    }
    return res
  }

  // 网络请求处理函数
  if (req.url.includes('hdslb.com')) {
    if (req.url.includes('HarmonyOS')) {
      return fetch(req)
    }
    // 获取路径;
    const path = req.url.replace(/(https|http)?:\/\/(.[^/]+)/, '')
    const 站点镜像源 = [
      `https://i0.hdslb.com`,
      `https://i1.hdslb.com/`,
      `https://i2.hdslb.com/`,
      `https://s1.hdslb.com/`,
      `https://s2.hdslb.com`,
      `https://s3.hdslb.com/`,
    ]
    for (var i in 站点镜像源) {
      站点镜像源[i] += path
    }
    return 并发请求(站点镜像源)
  }
  // 天翔TNXG云存储处理函数
  if (req.url.includes('https://assets.tnxg.whitenuo.cn')) {
    console.log('[TNXG_SW]检测到网络请求：' + req.url)
    // 天翔TNXG云存储图片WebP处理
    if (req.headers.get('accept').includes('webp')) {
      if (
        req.url.includes('.jpg') ||
        req.url.includes('.png') ||
        req.url.includes('.gif') ||
        req.url.includes('.jpeg')
      ) {
        let webpReq = new Request(req.url + '?fmt=webp', req)
        console.log(
          '[TNXG_SW]检测到TNXG桶的图片请求[方式1]，转换WebP：' +
            req.url +
            '?fmt=webp',
        )
        return fetch(webpReq)
      }
    }
  }
  if (
    req.url.includes('/_next/image?url=https%3A%2F%2Fassets.tnxg.whitenuo.cn')
  ) {
    console.log('[TNXG_SW]检测到网络请求：' + req.url)
    // 将常见图片存在数组中
    const imgList = ['.jpg', '.png', '.gif', '.jpeg']
    // 如果url中包含常见图片后缀名则删除https://tnxg.top/_next/image?url=
    for (var i in imgList) {
      if (req.url.includes(imgList[i])) {
        imgurl = req.url.replace('https://tnxg.top/_next/image?url=', '')
        imgurl = decodeURIComponent(imgurl)
        console.log('[TNXG_SW]检测到Shiro图片代理链接，转换为直链：' + imgurl)
        imgurl = imgurl.split('&')[0]
        if (req.headers.get('accept').includes('webp')) {
          let webpReq = new Request(imgurl + '?fmt=webp', req)
          console.log(
            '[TNXG_SW]检测到TNXG桶的图片请求[方式2]，转换WebP：' +
              imgurl +
              '?fmt=webp',
          )
          return fetch(webpReq)
        } else {
          return fetch(req)
        }
      }
    }
  }

  if (req.url.includes('jsdelivr.net')) {
    console.log('[TNXG_SW]检测到网络请求：' + req.url)
    // 获取请求路径
    const path = req.url.replace(/(https|http)?:\/\/(.[^/]+)/, '')
    const jsdelivr_mirror = [
      `https://cdn2.chuqis.com` + path,
      `https://jsd.onmicrosoft.cn` + path,
    ]
    return 并发请求(jsdelivr_mirror)
  }
  return fetch(req)
}
