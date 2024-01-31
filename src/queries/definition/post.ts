import { useMutation } from '@tanstack/react-query'
import type { PaginateResult, PostModel, TagModel } from '@mx-space/api-client'
import type { PostDto } from '~/models/writing'

import { useResetAutoSaverData } from '~/components/modules/dashboard/writing/BaseWritingProvider'
import { cloneDeep } from '~/lib/_'
import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { toast } from '~/lib/toast'

import { defineQuery } from '../helper'

export const post = {
  bySlug: (category: string, slug: string) =>
    defineQuery({
      queryKey: ['post', category, slug],
      meta: {
        hydrationRoutePath: routeBuilder(Routes.Post, {
          category,
          slug,
        }),
      },
      queryFn: async ({ queryKey }) => {
        const [, category, slug] = queryKey

        const data = await apiClient.post.getPost(category, slug)

        return data.$serialized
      },
    }),
}

export const postAdmin = {
  paginate: (page?: number) =>
    defineQuery({
      queryKey: ['postAdmin', 'paginate', page],
      queryFn: async ({ pageParam }: any) => {
        const data = await apiClient.post.getList(pageParam ?? page)

        return data.$serialized
      },
    }),

  allCategories: () =>
    defineQuery({
      queryKey: ['postAdmin', 'allCategories'],
      queryFn: async () => {
        const data = await apiClient.category.getAllCategories()

        return data.$serialized
      },
    }),

  getPost: (id: string) =>
    defineQuery({
      queryKey: ['postAdmin', 'getPost', id],
      queryFn: async () => {
        const data = await apiClient.post.getPost(id)

        const dto = {
          ...data.$serialized,
          relatedId: data.related?.map((i) => i.id) || [],
        } as PostDto

        return dto
      },
    }),

  getAllTags: () =>
    defineQuery({
      queryKey: ['postAdmin', 'getAllTags'],
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
      queryKey: ['postAdmin', 'getRelatedList'],

      queryFn: async ({ pageParam }: any) => {
        return apiClient.proxy.posts.get({
          params: {
            page: pageParam || 1,
            size: 50,
            select: 'id title _id slug category categoryId',
          },
        }) as Promise<
          PaginateResult<
            Pick<PostModel, 'id' | 'title' | 'slug' | 'category' | 'categoryId'>
          >
        >
      },
    }),
}

export const useCreatePost = () => {
  const resetAutoSaver = useResetAutoSaverData()
  return useMutation({
    mutationFn: (data: PostDto) => {
      const readonlyKeys = [
        'id',
        'related',
        'modified',
        'category',
      ] as (keyof PostModel)[]
      const nextData = cloneDeep(data) as any
      for (const key of readonlyKeys) {
        delete nextData[key]
      }
      return apiClient.post.proxy.post<{
        id: string
      }>({
        data: nextData,
      })
    },
    onSuccess: () => {
      toast.success('创建成功')
      resetAutoSaver('post')
    },
  })
}

export const useUpdatePost = () => {
  const resetAutoSaver = useResetAutoSaverData()
  return useMutation({
    mutationFn: (data: PostDto) => {
      const { id } = data
      const readonlyKeys = [
        'id',
        'related',
        'modified',
        'category',
      ] as (keyof PostModel)[]
      const nextData = cloneDeep(data) as any
      for (const key of readonlyKeys) {
        delete nextData[key]
      }
      return apiClient.post.proxy(id).put<{
        id: string
      }>({
        data: nextData,
      })
    },
    onSuccess: ({ id }) => {
      toast.success('更新成功')
      resetAutoSaver('post', id)
    },
  })
}
