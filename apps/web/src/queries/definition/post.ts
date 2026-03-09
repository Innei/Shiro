import type {
  ModelWithLiked,
  ModelWithTranslation,
  PostModel,
} from '@mx-space/api-client'

import { apiClient } from '~/lib/request'

import { defineQuery } from '../helper'

export type PostWithTranslation = ModelWithLiked<
  ModelWithTranslation<PostModel>
>

export const post = {
  bySlug: (category: string, slug: string, lang?: string) =>
    defineQuery({
      queryKey: ['post', category, slug, lang],

      queryFn: async ({ queryKey }) => {
        const [, category, slug, lang] = queryKey as [
          string,
          string,
          string,
          string | undefined,
        ]

        const data = await apiClient.post.getPost(category, slug, {
          lang: lang || undefined,
          prefer: 'lexical',
        })

        return data.$serialized as PostWithTranslation
      },
    }),
}
