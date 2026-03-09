import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { NormalContainer } from '~/components/layout/container/Normal'
import { PostItemComposer } from '~/components/modules/post/PostItemComposer'
import { NothingFound } from '~/components/modules/shared/NothingFound'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

interface CategoryPageParams extends LocaleParams {
  category: string
}

export const generateMetadata = async (props: {
  params: Promise<CategoryPageParams>
}): Promise<Metadata> => {
  const { locale, category } = await props.params
  const t = await getTranslations({
    namespace: 'common',
    locale,
  })

  return {
    title: `${category} - ${t('page_title_category')}`,
  }
}

// 分页获取所有文章
async function fetchAllPosts(lang?: string) {
  const pageSize = 50
  let allPosts: any[] = []
  let page = 1
  let hasMore = true

  try {
    while (hasMore) {
      const result = await apiClient.post.getList(page, pageSize, {
        truncate: 310,
        lang,
      })
      allPosts = allPosts.concat(result.data)

      if (!result.pagination?.hasNextPage) {
        hasMore = false
      } else if (result.data.length < pageSize) {
        hasMore = false
      } else {
        page++
      }
    }
  } catch (e) {
    console.error('Error fetching posts:', e)
  }

  return allPosts
}

export default definePrerenderPage<CategoryPageParams>()({
  fetcher: async (params) => {
    const { category: categorySlug, locale } = params

    // 获取所有文章，然后过滤
    const posts = await fetchAllPosts(locale)

    const filteredPosts = posts.filter(
      (post: any) => post.category?.slug === categorySlug,
    )

    // 获取分类名称
    const categoryName = filteredPosts[0]?.category?.name || categorySlug

    return {
      posts: filteredPosts,
      categoryName,
      categorySlug,
    }
  },

  Component: async (props) => {
    const { data } = props
    const { posts, categoryName, categorySlug } = data

    if (!posts || posts.length === 0) {
      return <NothingFound />
    }

    return (
      <NormalContainer>
        <header className="prose mb-8">
          <h1 className="mb-2 text-3xl font-bold">{categoryName}</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            共 {posts.length} 篇文章
          </p>
        </header>

        <ul>
          {posts.map((item: any, index: number) => (
            <PostItemComposer key={item.id} index={index} data={item} />
          ))}
        </ul>
      </NormalContainer>
    )
  },
})
