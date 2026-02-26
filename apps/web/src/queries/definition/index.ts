import { aggregation } from './aggregation'
import { note } from './note'
import { page } from './page'
import type { PostWithTranslation } from './post'
import { post } from './post'

export type { PostWithTranslation }

export const queries = {
  aggregation,
  note,
  post,
  page,
}
