import type { ModelWithLiked, PostModel } from '@mx-space/api-client'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import type { Article, WithContext } from 'schema-dts'

import { AckRead } from '~/components/common/AckRead'
import { ClientOnly } from '~/components/common/ClientOnly'
import { PageColorGradient } from '~/components/common/PageColorGradient'
import {
  buildRoomName,
  Presence,
  RoomProvider,
} from '~/components/modules/activity'
import { CommentAreaRootLazy } from '~/components/modules/comment'
import {
  PostActionAside,
  PostBottomBarAction,
  PostCopyright,
  PostOutdate,
  PostRelated,
} from '~/components/modules/post'
import { GoToAdminEditingButton } from '~/components/modules/shared/GoToAdminEditingButton'
import { ReadIndicatorForMobile } from '~/components/modules/shared/ReadIndicator'
import { SummarySwitcher } from '~/components/modules/shared/SummarySwitcher'
import { TocFAB } from '~/components/modules/toc/TocFAB'
import { XLogInfoForPost } from '~/components/modules/xlog'
import { getCidForBaseModel } from '~/components/modules/xlog/utils'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'
import { CurrentPostDataProvider } from '~/providers/post/CurrentPostDataProvider'
import {
  LayoutRightSidePortal,
  LayoutRightSideProvider,
} from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import type { PageParams } from './api'
import { getData } from './api'
import {
  HeaderMetaInfoSetting,
  LdJsonWithAuthor,
  MarkdownSelection,
  PostDataReValidate,
  PostMarkdown,
  PostMarkdownImageRecordProvider,
  PostMetaBarInternal,
  PostTitle,
  SlugReplacer,
} from './pageExtra'

export const dynamic = 'force-dynamic'

export const generateMetadata = async (props: {
  params: Promise<PageParams>
}): Promise<Metadata> => {
  const params = await props.params
  const { slug } = params
  try {
    const data = await getData(params)
    const {
      title,
      category: { slug: categorySlug },
      text,
      meta,
    } = data
    const description = getSummaryFromMd(text ?? '')

    const ogImage = await getOgUrl('post', {
      category: categorySlug,
      slug,
    })

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage,
        type: 'article',
      },
      twitter: {
        images: ogImage,
        title,
        description,
        card: 'summary_large_image',
      },
      keywords: meta?.keywords,
      category: categorySlug,
    } satisfies Metadata
  } catch {
    return {}
  }
}

const Summary = async ({ data }: { data: ModelWithLiked<PostModel> }) => {
  const acceptLang = (await headers()).get('accept-language')

  const { id } = data
  const { summary } = await apiClient.ai
    .getSummary({
      articleId: id,
      onlyDb: true,
      lang: acceptLang || undefined,
    })
    .then((res) => ({
      summary: res?.summary,
    }))
    .catch(() => ({
      summary: false,
    }))
  return (
    <SummarySwitcher
      articleId={id!}
      enabledMixSpaceSummary={summary !== false}
      cid={getCidForBaseModel(data)}
      hydrateText={summary as string}
      summary={data.summary || ''}
      className="mb-8"
    />
  )
}
const PostPage = ({ data }: { data: ModelWithLiked<PostModel> }) => {
  const { id } = data
  return (
    <div className="relative w-full min-w-0">
      <AckRead id={id} type="post" />
      <HeaderMetaInfoSetting />
      <div>
        <div className="mb-8">
          <PostTitle />
          <GoToAdminEditingButton
            id={id!}
            type="posts"
            className="absolute -top-6 right-0"
          />

          <PostMetaBarInternal className="mb-8 justify-center" />

          <Summary data={data} />

          <PostOutdate />

          <PostRelated infoText="阅读此文章之前，你可能需要首先阅读以下的文章才能更好的理解上下文。" />
        </div>
        <WrappedElementProvider eoaDetect>
          <ReadIndicatorForMobile />
          <Presence />
          <PostMarkdownImageRecordProvider>
            <MarkdownSelection>
              <article className="prose">
                <div className="sr-only">
                  <PostTitle />
                </div>
                <PostMarkdown />
              </article>
            </MarkdownSelection>
          </PostMarkdownImageRecordProvider>

          <LayoutRightSidePortal>
            <PostActionAside />
          </LayoutRightSidePortal>
        </WrappedElementProvider>
      </div>
      <ClientOnly>
        <PostRelated infoText="关联阅读" />
        <PostCopyright />

        {/* <SubscribeBell defaultType="post_c" /> */}
        <XLogInfoForPost />
        <PostBottomBarAction />
      </ClientOnly>
    </div>
  )
}

export default definePrerenderPage<PageParams>()({
  fetcher(params) {
    return getData(params)
  },

  Component: async (props) => {
    const { data, params, fetchedAt } = props

    const fullPath = `/posts/${data.category.slug}/${data.slug}`
    const currentPath = `/posts/${params.category}/${params.slug}`

    const jsonLd: WithContext<Article> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.title,
      image: data.meta?.cover ? [data.meta.cover] : undefined,
      description: data.summary || data.text.slice(0, 200),
      datePublished: data.created,
      dateModified: data.modified || undefined,
    }

    return (
      <>
        {currentPath !== fullPath && <SlugReplacer to={fullPath} />}
        <LdJsonWithAuthor baseLdJson={jsonLd} />

        <PageColorGradient seed={data.title + data.category.name} />
        <CurrentPostDataProvider data={data} />
        <PostDataReValidate fetchedAt={fetchedAt} />
        <div
          data-server-fetched-at={fetchedAt}
          className="relative flex min-h-[120px] grid-cols-[auto,200px] lg:grid"
        >
          <BottomToUpTransitionView className="min-w-0">
            <RoomProvider roomName={buildRoomName(data.id)}>
              <PostPage data={data} />
            </RoomProvider>

            <BottomToUpSoftScaleTransitionView delay={500}>
              <CommentAreaRootLazy
                refId={data.id}
                allowComment={data.allowComment}
              />
            </BottomToUpSoftScaleTransitionView>
          </BottomToUpTransitionView>

          <LayoutRightSideProvider className="relative hidden lg:block" />
        </div>

        <OnlyMobile>
          <TocFAB />
        </OnlyMobile>
      </>
    )
  },
})
