import { Redis } from '@upstash/redis'

export const kvKeys = {
  totalPageViews: 'total_page_views',
  lastVisitor: 'last_visitor',
  currentVisitor: 'current_visitor',
  postViews: (id: string) => `post:views:${id}`,
  postReactions: (id: string) => `post:reactions:${id}`,
} as const

export const redis = new Redis({
  url: process.env.UPSTASH_URL!,
  token: process.env.UPSTASH_TOKEN!,
})
