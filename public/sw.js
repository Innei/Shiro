const CACHE_NAME = 'Shiro_ServiceWorker_CACHE';
let cachelist = [];
self.addEventListener('install', async function (installEvent) {
    self.skipWaiting();
    installEvent.waitUntil(caches.open(CACHE_NAME)
        .then(function (cache) {
            console.log('[Shiro_ServiceWorker]Opened cache');
            return cache.addAll(cachelist);
        }));
});
self.addEventListener('fetch', async event => {
    event.respondWith(handle(event.request))
});
const handle = async (req) => {
    const urlStr = req.url
    const urlObj = new URL(urlStr);
    const urlPath = urlObj.pathname;
    const domain = urlObj.hostname;

    self.db = {
        read: (key, config) => {
            if (!config) {
                config = { type: "text" }
            }
            return new Promise((resolve, reject) => {
                caches.open(CACHE_NAME).then(cache => {
                    cache.match(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)).then(function (res) {
                        if (!res) resolve(null)
                        res.text().then(text => resolve(text))
                    }).catch(() => {
                        resolve(null)
                    })
                })
            })
        }, write: (key, value) => {
            return new Promise((resolve, reject) => {
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), new Response(value));
                    resolve()
                }).catch(() => {
                    reject()
                })
            })
        }
    }
    const 并发请求 = async (urls, url) => {
        let controller = new AbortController();
        const PauseProgress = async (res) => {
            return new Response(await (res).arrayBuffer(), { status: res.status, headers: res.headers });
        };
        if (!Promise.any) {
            Promise.any = function (promises) {
                return new Promise((resolve, reject) => {
                    promises = Array.isArray(promises) ? promises : []
                    let len = promises.length
                    let errs = []
                    if (len === 0) return reject(new AggregateError('All promises were rejected'))
                    promises.forEach((promise) => {
                        promise.then(value => {
                            resolve(value)
                        }, err => {
                            len--
                            errs.push(err)
                            if (len === 0) {
                                reject(new AggregateError(errs))
                            }
                        })
                    })
                })
            }
        }
        return Promise.any(urls.map(urls => {
            return new Promise((resolve, reject) => {
                fetch(urls, {
                    signal: controller.signal
                })
                    .then(PauseProgress)
                    .then(res => {
                        if (res.status == 200 || res.status == 304 || res.status == 404) {
                            controller.abort()
                            resolve(res)
                        } else {
                            reject(res)
                        }
                    })
                    .catch(e => reject(e))
            })
        }))
    }
    if (req.url.includes('hdslb.com')) {
        const path = req.url.replace(/(https|http)?:\/\/(.[^/]+)/, '');
        const bili_mirror = [
            `https://i0.hdslb.com`,
            `https://i1.hdslb.com/`,
            `https://i2.hdslb.com/`,
            `https://s1.hdslb.com/`,
            `https://s2.hdslb.com`,
            `https://s3.hdslb.com/`,
        ]
        for (var i in bili_mirror) {
            bili_mirror[i] += path;
        }
        return 并发请求(bili_mirror);
    }
    if (req.url.includes('jsdelivr.net')) {
        console.log('[Shiro_ServiceWorker]检测到网络请求：' + req.url);
        const path = req.url.replace(/(https|http)?:\/\/(.[^/]+)/, '');
        // 可以在这里添加jsdelivr镜像源
        const jsdelivr_mirror = [
            `https://jsd.onmicrosoft.cn` + path,
        ]
        return 并发请求(jsdelivr_mirror);
    }
}
return fetch(req)