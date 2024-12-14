import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/login/', '/preview/', '/dashboard', '/_next'],
      },
    ],
  }
}
