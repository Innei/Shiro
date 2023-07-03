import dayjs from 'dayjs'
import type { NoteWrappedPayload } from '@mx-space/api-client'

import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'

import { defineQuery } from '../helper'

const LATEST_KEY = 'latest'
export const note = {
  byNid: (nid: string, password?: string | null) =>
    defineQuery({
      queryKey: ['note', nid],
      meta: {
        hydrationRoutePath: routeBuilder(Routes.Note, { id: nid }),
        shouldHydration: (data: NoteWrappedPayload) => {
          const note = data?.data
          const isSecret = note?.secret
            ? dayjs(note?.secret).isAfter(new Date())
            : false
          return !isSecret
        },
      },
      queryFn: async ({ queryKey }) => {
        const [, id] = queryKey

        if (id === LATEST_KEY) {
          return (await apiClient.note.getLatest()).$serialized
        }
        const data = await apiClient.note.getNoteById(+queryKey[1], password!)

        return { ...data } as NoteWrappedPayload
      },
    }),
}
