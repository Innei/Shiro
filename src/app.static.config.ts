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
}

export const CDN_HOST = 'cdn.innei.ren'
export const TENCENT_CDN_DOMAIN = CDN_HOST
