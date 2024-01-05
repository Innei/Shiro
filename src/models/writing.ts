import type { Pager, PaginateResult } from '@mx-space/api-client'

export { Pager, PaginateResult }
export interface Count {
  read: number
  like: number
}

export interface Image {
  height: number
  width: number
  type: string
  accent?: string
  src: string
}

export class BaseModel {
  created?: Date
  id?: string
}

export type WriteBaseType = {
  title: string
  text: string
  allowComment: boolean

  id?: string
  images: Image[]
  created?: string
  modified?: string

  meta?: any
}

export type PostDto = WriteBaseType & {
  slug: string
  categoryId: string
  copyright: boolean
  tags: string[]
  summary: string
  pinOrder: number
  pin: boolean
  relatedId: string[]
}
