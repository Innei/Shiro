import { clsx } from 'clsx'
import type { Metadata } from 'next'
import type { Article, WithContext } from 'schema-dts'

import { AckRead } from '~/components/common/AckRead'
import { ClientOnly } from '~/components/common/ClientOnly'

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
import { TocFAB } from '~/components/modules/toc/TocFAB'
import { TocHeadingStrategyProvider } from '~/components/modules/toc/TocHeadingStrategy'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import { definePrerenderPage } from '~/lib/request.server'
import {
  buildLanguageAlternates,
  buildLocalePrefixedPath,
  getSupportedLocalesFromTranslations,
} from '~/lib/seo/hreflang'
import { CurrentPostDataProvider } from '~/providers/post/CurrentPostDataProvider'
import {
  LayoutRightSidePortal,
  LayoutRightSideProvider,
} from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import type { PageParams, PostDataResult, PostWithTranslation } from './api'
import { getData } from './api'
import {
  FocusReadingEffect,
  LdJsonWithAuthor,
  MarkdownSelection,
  PostDataReValidate,
  PostMarkdownImageRecordProvider,
  PostMetaBarInternal,
  PostTitle,
  SlugReplacer,
} from './pageExtra'
import { PostContent } from './PostContent'

export const dynamic = 'force-dynamic'

export const generateMetadata = async (props: {
  params: Promise<PageParams>
  searchParams: Promise<{ lang?: string }>
}): Promise<Metadata> => {
  const params = await props.params
  const searchParams = await props.searchParams
  try {
    const { post: data } = await getData({
      ...params,
      lang: searchParams.lang,
    })
    const {
      category: { slug: categorySlug },
      meta,
    } = data
    const description = getSummaryFromMd(data.text ?? '')

    const ogImage = await getOgUrl(
      'post',
      {
        category: categorySlug,
        slug: data.slug,
      },
      params.locale,
    )

    const canonicalPathNoLocale = `/posts/${categorySlug}/${data.slug}`
    const canonicalPath = buildLocalePrefixedPath(
      params.locale as any,
      canonicalPathNoLocale,
    )
    const supportedLocales = getSupportedLocalesFromTranslations({
      sourceLang: data.translationMeta?.sourceLang,
      availableTranslations: (data as any).availableTranslations,
    })

    return {
      title: data.title,
      description,
      openGraph: {
        title: data.title,
        description,
        images: ogImage,
        type: 'article',
      },
      twitter: {
        images: ogImage,
        title: data.title,
        description,
        card: 'summary_large_image',
      },
      keywords: meta?.keywords,
      category: categorySlug,
      alternates: {
        canonical: canonicalPath,
        languages: {
          ...buildLanguageAlternates(canonicalPathNoLocale, supportedLocales),
          'x-default': canonicalPathNoLocale,
        },
      },
    } satisfies Metadata
  } catch {
    return {}
  }
}

const PostPage = ({ data }: { data: PostWithTranslation }) => {
  const { id } = data
  return (
    <div className="relative w-full min-w-0">
      <AckRead id={id} type="post" />
      <div>
        <div className="mb-8">
          <PostTitle />
          <GoToAdminEditingButton
            id={id!}
            type="posts"
            className="absolute -top-6 right-0"
          />

          <PostMetaBarInternal className="mb-8 justify-center" />

          <PostOutdate />

          <PostRelated type="before" />
        </div>
        <WrappedElementProvider eoaDetect>
          <ReadIndicatorForMobile />
          <PostMarkdownImageRecordProvider>
            <MarkdownSelection>
              <article
                className={'prose'}
              >
                <div className="sr-only">
                  <PostTitle />
                </div>
                <FocusReadingEffect />
                <PostContent
                  contentFormat={data.contentFormat}
                  content={data.content}
                />
              </article>
            </MarkdownSelection>
          </PostMarkdownImageRecordProvider>

          <LayoutRightSidePortal>
            <PostActionAside />
          </LayoutRightSidePortal>
        </WrappedElementProvider>
      </div>
      <ClientOnly>
        <PostRelated />
        <PostCopyright />

        {/* <SubscribeBell defaultType="post_c" /> */}
        <PostBottomBarAction />
      </ClientOnly>
    </div>
  )
}

export default definePrerenderPage<PageParams>()<PostDataResult>({
  fetcher(params) {
    return getData(params)
  },

  Component: async (props) => {
    const { data: fetchedData, params, fetchedAt } = props
    const { post: data } = fetchedData

    const fullPath = `/posts/${data.category.slug}/${data.slug}`
    const currentPath = `/posts/${params.category}/${params.slug}`

    const jsonLd: WithContext<Article> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.title,
      image: data.meta?.cover ? [data.meta.cover] : undefined,
      description: data.summary || (data.text ?? '').slice(0, 200),
      datePublished: data.created,
      dateModified: data.modified || undefined,
    }

    return (
      <TocHeadingStrategyProvider
        contentFormat={data.contentFormat}
        content={data.content}
      >
        {currentPath !== fullPath && <SlugReplacer to={fullPath} />}
        <LdJsonWithAuthor baseLdJson={jsonLd} />

        <CurrentPostDataProvider data={data} />
        <PostDataReValidate fetchedAt={fetchedAt} />
        <div
          data-server-fetched-at={fetchedAt}
          className="relative flex min-h-[120px] grid-cols-[auto_200px] lg:grid"
        >
          <BottomToUpTransitionView lcpOptimization className="min-w-0">
            <PostPage data={data} />

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
      </TocHeadingStrategyProvider>
    )
  },
})
