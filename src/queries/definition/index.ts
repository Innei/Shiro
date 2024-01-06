import { aggregation } from './aggregation'
import { commentAdmin } from './comment'
import { note } from './note'
import { page } from './page'
import { post, postAdmin } from './post'

export const queries = {
  aggregation,
  note,
  post,
  page,
}

export const adminQueries = { post: postAdmin, comment: commentAdmin }
