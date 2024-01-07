import dayjs from 'dayjs'
import type {
  NoteModel,
  NoteWrappedPayload,
  PaginateResult,
  TagModel,
} from '@mx-space/api-client'
import type { NoteDto } from '~/models/writing'

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

export const noteAdmin = {
  paginate: (page?: number) =>
    defineQuery({
      queryKey: ['noteAdmin', 'paginate', page],
      queryFn: async ({ pageParam }: any) => {
        const data = await apiClient.note.getList(pageParam ?? page)

        return data.$serialized
      },
    }),

  allTopic: () =>
    defineQuery({
      queryKey: ['noteAdmin', 'allTopic'],
      queryFn: async () => {
        const data = await apiClient.topic.getAll()

        return data.$serialized
      },
    }),

  getNote: (id: string) =>
    defineQuery({
      queryKey: ['noteAdmin', 'getNote', id],
      queryFn: async () => {
        const data = await apiClient.note.getNoteById(id)

        const dto = data.$serialized as NoteDto

        return dto
      },
    }),

  getAllTags: () =>
    defineQuery({
      queryKey: ['noteAdmin', 'getAllTags'],
      queryFn: async () => {
        const { data } = await apiClient.proxy.categories.get<{
          data: TagModel[]
        }>({
          params: { type: 'Tag' },
        })
        return data.map((i) => ({
          label: `${i.name} (${i.count})`,
          value: i.name,
          key: i.name,
        }))
      },
    }),

  getRelatedList: () =>
    defineQuery({
      queryKey: ['noteAdmin', 'getRelatedList'],

      queryFn: async ({ pageParam }: any) => {
        return apiClient.proxy.posts.get({
          params: {
            page: pageParam || 1,
            size: 50,
            select: 'id title _id slug category categoryId',
          },
        }) as Promise<PaginateResult<NoteModel>>
      },
    }),
}
