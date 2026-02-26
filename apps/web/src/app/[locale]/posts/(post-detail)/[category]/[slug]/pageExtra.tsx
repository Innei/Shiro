'use client'

import type { Image } from '@mx-space/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { useLocale } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import type { BlogPosting, WithContext } from 'schema-dts'

import { appStaticConfig } from '~/app.static.config'
import { useFocusReading } from '~/atoms/hooks/reading'
import { withClientOnly } from '~/components/common/ClientOnly'
import { PostMetaBar } from '~/components/modules/post/PostMetaBar'
import { WithArticleSelectionAction } from '~/components/modules/shared/WithArticleSelectionAction'
import { useRouter } from '~/i18n/navigation'
import { logger } from '~/lib/logger'
import { noopArr } from '~/lib/noop'
import { MarkdownImageRecordProvider } from '~/providers/article/MarkdownImageRecordProvider'
import {
  useCurrentPostDataSelector,
  useSetCurrentPostData,
} from '~/providers/post/CurrentPostDataProvider'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'
import type { PostWithTranslation } from '~/queries/definition'
import { queries } from '~/queries/definition'

export const LdJsonWithAuthor = ({
  baseLdJson,
}: {
  baseLdJson: WithContext<BlogPosting>
}) => {
  const jsonLd = useAggregationSelector(
    (state) =>
      ({
        ...baseLdJson,
        author: {
          '@type': 'Person',
          name: state.user.name,
          url: state.url.webUrl,
        },
      }) as WithContext<BlogPosting>,
  )
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  )
}
export const PostTitle = () => {
  const title = useCurrentPostDataSelector((data) => data?.title)!

  return (
    <h1 className="mb-8 text-balance text-center text-4xl font-bold leading-tight">
      {title}
    </h1>
  )
}
export const MarkdownSelection: Component = (props) => {
  const id = useCurrentPostDataSelector((data) => data?.id)!
  const title = useCurrentPostDataSelector((data) => data?.title)!
  const allowComment = useCurrentPostDataSelector((data) => data?.allowComment)!
  return (
    <WithArticleSelectionAction
      refId={id}
      title={title}
      canComment={allowComment}
    >
      {props.children}
    </WithArticleSelectionAction>
  )
}
export const FocusReadingEffect = () => {
  useFocusReading()
  return null
}

export const PostMarkdownImageRecordProvider = (props: PropsWithChildren) => {
  const images = useCurrentPostDataSelector(
    (data) => data?.images || (noopArr as Image[]),
  )

  return (
    <MarkdownImageRecordProvider images={images || noopArr}>
      {props.children}
    </MarkdownImageRecordProvider>
  )
}
export const PostMetaBarInternal: Component = ({ className }) => {
  const meta = useCurrentPostDataSelector((data) => {
    if (!data) return
    return {
      created: data.created,
      category: data.category,
      tags: data.tags,
      count: data.count,
      modified: data.modified,
    }
  })

  if (!meta) return null
  return (
    <PostMetaBar meta={meta} className={className} />
  )
}

export const PostDataReValidate: FC<{
  fetchedAt: string
}> = withClientOnly(({ fetchedAt }) => {
  const isOutdated = useMemo(
    () =>
      Date.now() - new Date(fetchedAt).getTime() > appStaticConfig.revalidate,
    [fetchedAt],
  )
  const dataSetter = useSetCurrentPostData()

  const locale = useLocale()

  const { category, slug } = useCurrentPostDataSelector((post) => {
    if (!post) return {}
    return {
      category: post.category,
      slug: post.slug,
    }
  })
  const onceRef = useRef(false)
  const queryClient = useQueryClient()
  useEffect(() => {
    if (onceRef.current) return

    onceRef.current = true
    if (!isOutdated) return

    if (!category || !slug) return

    queryClient
      .fetchQuery(queries.post.bySlug(category.slug, slug, locale))
      .then((data) => {
        dataSetter(data as PostWithTranslation)
        // toast.info('此文章访问的内容已过期，所以页面数据自动更新了。')
        logger.log('Post data revalidated', data)
      })
  }, [category, dataSetter, isOutdated, locale, queryClient, slug])
  return null
})

export const SlugReplacer = ({ to }: { to: string }) => {
  const router = useRouter()
  const onceRef = useRef(false)

  if (!onceRef.current) {
    onceRef.current = true
    router.replace(to)
  }

  return null
}
