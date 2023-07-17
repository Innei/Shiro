// 添加监听器 / AddEventListener
const CACHE_NAME = 'TNXG_BLOG_CACHE';
let cachelist = [];
self.addEventListener('install', async function (installEvent) {
    self.skipWaiting();
    installEvent.waitUntil(caches.open(CACHE_NAME)
        .then(function (cache) {
            console.log('[TNXG_SW]Opened cache');
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
                config = {type: "text"}
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
    // 对数组内所有地址进行请求，返回第一个成功的请求结果并打断其他请求
    const 并发请求 = async (urls, url) => {
        let controller = new AbortController();
        const PauseProgress = async (res) => {
            return new Response(await (res).arrayBuffer(), {status: res.status, headers: res.headers});
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
    // 主站api函数
    // 拦截所有路径为域名/sw-req/的请求
    if (req.url.includes('/sw-req/')) {
        console.log('[TNXG_SW]检测到SW请求：' + req.url);
        let res = new Response('{"code":200,"msg":"TNXG_SW"}', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // 拦截所有路径为域名/api?getip的请求
        if (req.url.includes('/api?getip')) {
            return fetch('https://api.ip.sb/geoip')
        }
        return res;
    }

    // 网络请求处理函数
    if (req.url.includes('hdslb.com')) {
        if (req.url.includes("HarmonyOS")) {
            return fetch(req)
        }
        // 获取路径;
        const path = req.url.replace(/(https|http)?:\/\/(.[^/]+)/, '');
        const 站点镜像源 = [
            `https://i0.hdslb.com`,
            `https://i1.hdslb.com/`,
            `https://i2.hdslb.com/`,
            `https://s1.hdslb.com/`,
            `https://s2.hdslb.com`,
            `https://s3.hdslb.com/`,
        ]
        for (var i in 站点镜像源) {
            站点镜像源[i] += path;
        }
        return 并发请求(站点镜像源);
    }

    const 获取完整地址 = (path) => {
        path = path.split('?')[0].split('#')[0];
        if (path.match(/\/$/)) {
            path += 'index'
        }
        ;
        if (!path.match(/\.[a-zA-Z]+$/)) {
            path += '.html'
        }
        ;
        return path;
    };
    const 获取分流地址 = (packagename, blogversion, path) => {
        const 站点镜像源 = [
            `https://blog.tnxg.top`,
            `https://vercel.blog.tnxg.top`,
            'https://cloudflare.blog.tnxg.top',
            `https://npm.elemecdn.com/${packagename}@${blogversion}`,
        ]
        for (var i in 站点镜像源) {
            站点镜像源[i] += path;
        }
        return 站点镜像源;
    }
    const mirror = [
        `https://tnxg-proxy.deno.dev/https://registry.npmjs.org/tnxg-blog/latest`,
        `https://registry.npmjs.org/tnxg-blog/latest`,
        `https://mirrors.cloud.tencent.com/npm/tnxg-blog/latest`
    ]
    const 保存最新版本号 = async (mirror) => { //改为最新版本写入数据库
        return 并发请求(mirror, mirror[0])
            .then(res => res.json()) //JSON Parse
            .then(async res => {
                await db.write('tnxg_blog_version', res.version)  //写入
                console.log('[TNXG_SW]更新最新版本号：' + res.version)
            })
    }

    setTimeout(async () => {
        await 保存最新版本号(mirror)//打开十秒后更新,避免堵塞
    }, 10000)

    // 主站分流函数
    if (domain == 'blog.tnxg.top') {
        分流地址 = 获取分流地址('tnxg-blog', await db.read('tnxg_blog_version'), 获取完整地址(urlPath));
        console.log('[TNXG_SW]检测到主站请求：' + urlStr);
        return 并发请求(分流地址);
    }
    // 天翔TNXG云存储处理函数
    if (req.url.includes('assets.tnxg.whitenuo.cn')) {
        console.log('[TNXG_SW]检测到网络请求：' + req.url);
        // 天翔TNXG云存储图片WebP处理
        if (req.headers.get('accept').includes('webp')) {
            if (req.url.includes('.jpg') || req.url.includes('.png') || req.url.includes('.gif') || req.url.includes('.jpeg')) {
                let webpReq = new Request(req.url + '?fmt=webp', req);
                console.log('[TNXG_SW]检测到TNXG桶的图片请求，转换WebP：' + req.url + '?fmt=webp');
                return fetch(webpReq);
            }
        }
    }
    // 其余请求直接返回
    return fetch(req)
}

importScripts('https://assets.tnxg.whitenuo.cn/proxy/npm/workbox-cdn@5.1.3/workbox/workbox-sw.js');

workbox.setConfig({
    modulePathPrefix: 'https://assets.tnxg.whitenuo.cn/proxy/npm/workbox-cdn@5.1.3/workbox/'
});

//关闭日志
self.__WB_DISABLE_DEV_LOGS = true;

const {core, precaching, routing, strategies, expiration} = workbox;
const {CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate} = strategies;
const {ExpirationPlugin} = expiration;

const cacheSuffixVersion = '_20200610';

core.setCacheNameDetails({
    prefix: 'bycg', suffix: cacheSuffixVersion
});

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((keys) => {
        return Promise.all(keys.map((key) => {
            if (!key.includes(cacheSuffixVersion)) return caches.delete(key);
        }));
    }));
});


core.skipWaiting();
core.clientsClaim();

/**
 * 缓存第三方引用
 */
routing.registerRoute(/.*(cdn.jsdelivr.net|at.alicdn.com)/, new CacheFirst({
    cacheName: 'static-cdn' + cacheSuffixVersion, fetchOptions: {
        mode: 'cors', credentials: 'omit'
    }, plugins: [new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, purgeOnQuotaError: true
    })]
}));

//不作缓存
routing.registerRoute(/\/sw.js/, new NetworkOnly());


//缓存图片
routing.registerRoute(/.*\.(?:png|jpg|jpeg|svg|gif|webp)/, new CacheFirst({
    cacheName: 'static-image' + cacheSuffixVersion,
}));

//缓存js css
routing.registerRoute(/.*\.(css|js)$/, new CacheFirst({
    cacheName: 'static-js-css' + cacheSuffixVersion,
}));

//本站其他文件
routing.registerRoute(({url}) => {
    return url.hostname === location.hostname
}, new NetworkFirst({
    cacheName: 'static-other' + cacheSuffixVersion, plugins: [new ExpirationPlugin({
        maxEntries: 50, purgeOnQuotaError: true
    })]
}));
