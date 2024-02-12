import { activity } from './activity'
import { aggregation } from './aggregation'
import { commentAdmin } from './comment'
import { note, noteAdmin } from './note'
import { page } from './page'
import { post, postAdmin } from './post'

export const queries = {
  aggregation,
  note,
  post,
  page,
  activity,
}

export const adminQueries = {
  post: postAdmin,
  note: noteAdmin,
  comment: commentAdmin,
}
