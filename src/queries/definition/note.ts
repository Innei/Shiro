import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import type { NoteModel, NoteWrappedPayload } from '@mx-space/api-client'
import type { NoteDto } from '~/models/writing'

import { useResetAutoSaverData } from '~/components/modules/dashboard/writing/BaseWritingProvider'
import { cloneDeep } from '~/lib/lodash'
import { apiClient } from '~/lib/request.new'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { toast } from '~/lib/toast'

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
          const isSecret = note?.publicAt
            ? dayjs(note?.publicAt).isAfter(new Date())
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

        return data.$serialized.data
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
}

export const useCreateNote = () => {
  const resetAutoSaver = useResetAutoSaverData()
  return useMutation({
    mutationFn: (data: NoteDto) => {
      const readonlyKeys = [
        'id',
        'nid',
        'modified',
        'topic',
      ] as (keyof NoteModel)[]
      const nextData = cloneDeep(data) as any
      for (const key of readonlyKeys) {
        delete nextData[key]
      }
      return apiClient.note.proxy.post<{
        id: string
      }>({
        data: nextData,
      })
    },
    onSuccess: () => {
      toast.success('创建成功')
      resetAutoSaver('note')
    },
  })
}

export const useUpdateNote = () => {
  const resetAutoSaver = useResetAutoSaverData()
  return useMutation({
    mutationFn: (data: NoteDto) => {
      const { id } = data
      const readonlyKeys = [
        'id',
        'nid',
        'modified',
        'topic',
      ] as (keyof NoteModel)[]
      const nextData = cloneDeep(data) as any
      for (const key of readonlyKeys) {
        delete nextData[key]
      }
      return apiClient.note.proxy(id).put<{
        id: string
      }>({
        data: nextData,
      })
    },
    onSuccess: ({ id }) => {
      toast.success('更新成功')
      resetAutoSaver('note', id)
    },
  })
}
