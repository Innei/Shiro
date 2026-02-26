import type {
  ModelWithLiked,
  ModelWithTranslation,
  PostModel,
} from '@mx-space/api-client'

import { attachServerFetch } from '~/lib/attach-fetch'
import { getQueryClient } from '~/lib/query-client.server'
import { requestErrorHandler } from '~/lib/request.server'
import { queries } from '~/queries/definition'

export interface PageParams extends LocaleParams {
  category: string
  slug: string
  lang?: string
}

export type PostWithTranslation = ModelWithLiked<
  ModelWithTranslation<PostModel>
>

export interface PostDataResult {
  post: PostWithTranslation
}

const getPostData = async (
  params: Pick<PageParams, 'category' | 'slug'>,
  lang?: string,
) => {
  const { category, slug } = params
  await attachServerFetch()
  const data = await getQueryClient()
    .fetchQuery(queries.post.bySlug(category, slug, lang))
    .catch(requestErrorHandler)
  return data as PostWithTranslation
}

export const getData = async (params: PageParams): Promise<PostDataResult> => {
  // 如果指定了 lang=original，不传 lang 参数
  if (params.lang === 'original') {
    const post = await getPostData(params, 'original')
    return { post }
  }

  const preferredLang = params.lang || params.locale

  const post = await getPostData(params, preferredLang)

  return { post }
}
