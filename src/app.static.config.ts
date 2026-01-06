export const appStaticConfig = {
  ai: {
    summary: {
      enabled: true,
      providers: ['openai'],
    },
  },

  cache: {
    enabled: true,

    ttl: {
      aggregation: 3600,
    },
  },
}

export const CDN_HOST = 'cdn.innei.ren'
export const TENCENT_CDN_DOMAIN = CDN_HOST

export const s3Config = {
  accessKeyId: process.env.S3_ACCESS_KEY as string,
  secretAccessKey: process.env.S3_SECRET_KEY as string,
  bucket: 'uploads',
  customDomain: 'https://object.innei.in',
  endpoint: `https://de7ecb0eaa0a328071255d557a6adb66.r2.cloudflarestorage.com`,
}
