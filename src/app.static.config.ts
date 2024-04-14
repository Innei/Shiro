export const appStaticConfig = {
  ai: {
    summary: {
      enabled: true,
      // providers: ['openai', 'xlog'],
      providers: ['xlog'],
    },
  },

  cache: {
    enabled: true,

    ttl: {
      aggregation: 3600,
    },
  },

  revalidate: 1000 * 10, // 10s
  rss: {
    content: false, // rss 中是否包含文章内容
  },
} as const

export const CDN_HOST = 'cdn.innei.ren'
export const TENCENT_CDN_DOMAIN = CDN_HOST
