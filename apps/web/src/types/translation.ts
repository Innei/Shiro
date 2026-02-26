export interface AITranslation {
  id: string
  created: string
  hash: string
  refId: string
  refType: string
  lang: string
  sourceLang: string
  title: string
  text: string
  summary?: string
  tags?: string[]
}
