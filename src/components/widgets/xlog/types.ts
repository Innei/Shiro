export interface XLogMeta {
  pageId?: string
  cid?: string
  relatedUrls?: string[]
  metadata?: {
    network: string
    proof: string
    raw?: {
      [key: string]: any
    }
    owner?: string
    transactions?: string[]
    [key: string]: any
  }
}

declare module '@mx-space/api-client' {
  export interface PostMeta {
    xLog?: XLogMeta
  }
}
