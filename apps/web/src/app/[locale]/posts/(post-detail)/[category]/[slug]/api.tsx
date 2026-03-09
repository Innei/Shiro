import type {
  ModelWithLiked,
  ModelWithTranslation,
  PostModel,
} from '@mx-space/api-client'

import { attachServerFetch } from '~/lib/attach-fetch'
import { getQueryClient } from '~/lib/query-client.server'
import { requestErrorHandler } from '~/lib/request.server'
import { queries } from '~/queries/definition'

import { fetchAggregationData } from '../../../../api'

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
  categoryPosts?: PostModel[]
  categoryPostListConfig?: {
    enabled?: boolean
    sticky: boolean
  }
}

// 获取分类下的所有文章
async function getCategoryPosts(
  categorySlug: string,
): Promise<{
  posts: PostModel[]
  config: { enabled?: boolean; sticky: boolean }
}> {
  const pageSize = 50
  let allPosts: PostModel[] = []
  let page = 1
  let hasMore = true

  try {
    while (hasMore) {
      const result = await getQueryClient().fetchQuery(
        queries.post.list({ page, size: pageSize, truncate: 0 }),
      )
      allPosts = allPosts.concat(result.data as PostModel[])

      if (!result.pagination?.hasNextPage) {
        hasMore = false
      } else if (result.data.length < pageSize) {
        hasMore = false
      } else {
        page++
      }
    }
  } catch (e) {
    console.error('Error fetching category posts:', e)
  }

  // 筛选该分类的文章
  const categoryPosts = allPosts.filter(
    (post) => post.category?.slug === categorySlug,
  )

  // 获取主题配置
  let sticky = true
  let enabled: boolean | undefined
  try {
    const aggregationData = await fetchAggregationData()

    const categoryPostListConfig =
      aggregationData.theme?.config?.module?.categoryPostList

    if (categoryPostListConfig) {
      // 转换为小写以匹配 YAML 配置
      const categorySlugLower = categorySlug.toLowerCase()
      const categoryConfig =
        categoryPostListConfig.categories?.[categorySlugLower]

      // 获取是否启用配置
      if (categoryConfig?.enabled !== undefined) {
        enabled = categoryConfig.enabled
      }

      // 获取粘性配置
      sticky =
        categoryConfig?.sticky ?? categoryPostListConfig.default?.sticky ?? true
    }
  } catch (e) {
    console.error('Error fetching theme config:', e)
  }

  return {
    posts: categoryPosts,
    config: {
      enabled,
      sticky,
    },
  }
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
    // 获取分类下的其他文章
    const categoryPostsResult = await getCategoryPosts(params.category)
    return {
      post,
      categoryPosts: categoryPostsResult.posts,
      categoryPostListConfig: categoryPostsResult.config,
    }
  }

  const preferredLang = params.lang || params.locale

  const post = await getPostData(params, preferredLang)

  // 获取分类下的其他文章
  const categoryPostsResult = await getCategoryPosts(params.category)

  return {
    post,
    categoryPosts: categoryPostsResult.posts,
    categoryPostListConfig: categoryPostsResult.config,
  }
}
