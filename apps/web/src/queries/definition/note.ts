import type {
  NoteModel,
  NoteWrappedWithLikedAndTranslationPayload,
} from '@mx-space/api-client'
import { apiClient } from '~/lib/request'

import { defineQuery } from '../helper'

const LATEST_KEY = 'latest'
export const note = {
  byNid: (nid: string, password?: string | null, lang?: string) =>
    defineQuery({
      queryKey: ['note', nid, lang],

      queryFn: async ({ queryKey }) => {
        const [, id, lang] = queryKey as [string, string, string | undefined]

        if (id === LATEST_KEY) {
          return (await apiClient.note.getLatest()).$serialized
        }
        const data = await apiClient.note.getNoteByNid(Number(id), {
          password: password || undefined,
          lang: lang || undefined,
      
        })

        return data.$serialized as NoteWrappedWithLikedAndTranslationPayload
      },
    }),
}

