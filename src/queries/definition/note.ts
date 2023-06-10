import { apiClient } from '~/utils/request'

import { defineQuery } from './helper'

const LATEST_KEY = 'latest'
export const note = {
  byNid: (nid: string) =>
    defineQuery({
      queryKey: ['note', nid],
      queryFn: async ({ queryKey }) => {
        const [, id] = queryKey

        if (id === LATEST_KEY) {
          return (await apiClient.note.getLatest()).$serialized
        }
        const data = await apiClient.note.getNoteById(+queryKey[1])
        return { ...data }
      },
    }),
}
