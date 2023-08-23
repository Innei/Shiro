export type ArticleDataType =
  | {
      type: 'post'
      category: string
      slug: string
    }
  | {
      type: 'note'
      nid: number
    }
  | {
      type: 'page'
      slug: string
    }
