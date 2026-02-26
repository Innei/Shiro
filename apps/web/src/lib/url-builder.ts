import type {
  CategoryModel,
  NoteModel,
  PageModel,
  PostModel,
} from '@mx-space/api-client'

import { isDev } from '~/lib/env'
import { getAggregationData } from '~/providers/root/aggregation-data-provider'

export function urlBuilder(path = '') {
  if (isDev) return new URL(path, 'http://localhost:2323')
  return new URL(path, getAggregationData()?.url.webUrl)
}

export function isPostModel(model: any): model is PostModel {
  return (
    isDefined(model.title) && isDefined(model.slug) && !isDefined(model.order)
  )
}

export function isPageModel(model: any): model is PageModel {
  return (
    isDefined(model.title) && isDefined(model.slug) && isDefined(model.order)
  )
}

export function isNoteModel(model: any): model is NoteModel {
  return isDefined(model.title) && isDefined(model.nid)
}

function buildUrl(model: PostModel | NoteModel | PageModel) {
  if (isPostModel(model)) {
    // TODO
    if (!model.category) {
      console.error('PostModel.category is missing!!!!!')
      return '#'
    }
    return `/posts/${
      (model.category as CategoryModel).slug
    }/${encodeURIComponent(model.slug)}`
  } else if (isPageModel(model)) {
    return `/${model.slug}`
  } else if (isNoteModel(model)) {
    return `/notes/${model.nid}`
  }

  return '/'
}

function isDefined(data: any) {
  return data !== undefined && data !== null
}

urlBuilder.build = buildUrl
