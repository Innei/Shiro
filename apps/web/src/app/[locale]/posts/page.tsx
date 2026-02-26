import '~/components/modules/post/PostItem'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { NormalContainer } from '~/components/layout/container/Normal'
import { PostPagination } from '~/components/modules/post'
import { PostsSettingFab } from '~/components/modules/post/fab/PostsSettingsFab'
import { PostTagsFAB } from '~/components/modules/post/fab/PostTagsFAB'
import { PostItemComposer } from '~/components/modules/post/PostItemComposer'
import { NothingFound } from '~/components/modules/shared/NothingFound'
import { SearchFAB } from '~/components/modules/shared/SearchFAB'
import { BackToTopFAB } from '~/components/ui/fab'
import { OnlyDesktop } from '~/components/ui/viewport'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

import { PostListDataRevaildate } from './data-revalidate'
import { PostLoadMore } from './loader'

interface Props extends LocaleParams {
  page?: string
  size?: string
  sortBy?: string
  orderBy?: string
  view_mode?: string
  lang?: string
}

export const generateMetadata = async (
  props: NextPageParams<{ locale: string }>,
): Promise<Metadata> => {
  const { locale } = await props.params
  const t = await getTranslations({
    namespace: 'common',
    locale,
  })

  return {
    title: t('page_title_posts'),
  }
}

export default definePrerenderPage<Props>()({
  fetcher: async (params) => {
    const { page, size, orderBy, sortBy, lang, locale } = params || {}
    const currentPage = page ? Number.parseInt(page) : 1
    const currentSize = size ? Number.parseInt(size) : 10

    // 如果指定了 lang=original，不传 lang 参数
    const preferredLang = lang === 'original' ? undefined : lang || locale

    return await apiClient.post.getList(currentPage, currentSize, {
      sortBy: sortBy as any,
      sortOrder: orderBy === 'desc' ? -1 : 1,
      truncate: 310,
      lang: preferredLang,
    })
  },
  Component: async (props) => {
    const { params, fetchedAt } = props
    const { data, pagination } = props.data
    const { page } = params

    const currentPage = page ? Number.parseInt(page) : 1

    if (!data?.length) {
      return <NothingFound />
    }

    return (
      <NormalContainer>
        <PostListDataRevaildate fetchedAt={fetchedAt} />
        <ul data-fetch-at={fetchedAt}>
          {data.map((item, index) => (
            <PostItemComposer key={item.id} index={index} data={item} />
          ))}
        </ul>

        {currentPage > 1 ? (
          <PostPagination pagination={pagination} />
        ) : (
          pagination.hasNextPage && <PostLoadMore pagination={pagination} />
        )}

        <PostsSettingFab />
        <PostTagsFAB />
        <SearchFAB />
        <OnlyDesktop>
          <BackToTopFAB />
        </OnlyDesktop>
      </NormalContainer>
    )
  },
})
