/* eslint-disable no-console */
'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'
import type { Image } from '@mx-space/api-client'
import type { FC, PropsWithChildren } from 'react'

import { appStaticConfig } from '~/app.static.config'
import { withClientOnly } from '~/components/common/ClientOnly'
import { useSetHeaderMetaInfo } from '~/components/layout/header/hooks'
import { PostMetaBar } from '~/components/modules/post/PostMetaBar'
import { CurrentReadingCountingMetaBarItem } from '~/components/modules/shared/MetaBar'
import { WithArticleSelectionAction } from '~/components/modules/shared/WithArticleSelectionAction'
import { MainMarkdown } from '~/components/ui/markdown'
import { noopArr } from '~/lib/noop'
import { MarkdownImageRecordProvider } from '~/providers/article/MarkdownImageRecordProvider'
import {
  useCurrentPostDataSelector,
  useSetCurrentPostData,
} from '~/providers/post/CurrentPostDataProvider'
import { queries } from '~/queries/definition'

export const PostTitle = () => {
  const title = useCurrentPostDataSelector((data) => data?.title)!

  return <h1 className="text-balance text-center">{title}</h1>
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
export const PostMarkdown = () => {
  const text = useCurrentPostDataSelector((data) => data?.text)
  if (!text) return null

  return (
    <MainMarkdown
      allowsScript
      value={text}
      className="min-w-0 overflow-hidden"
    />
  )
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
export const HeaderMetaInfoSetting = () => {
  const setHeaderMetaInfo = useSetHeaderMetaInfo()
  const meta = useCurrentPostDataSelector((data) => {
    if (!data) return null

    return {
      title: data.title,
      description:
        data.category.name +
        (data.tags.length > 0 ? ` / ${data.tags.join(', ')}` : ''),
      slug: `${data.category.slug}/${data.slug}`,
    }
  })

  useEffect(() => {
    if (meta) setHeaderMetaInfo(meta)
  }, [meta])

  return null
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
    <PostMetaBar meta={meta} className={className}>
      <CurrentReadingCountingMetaBarItem />
    </PostMetaBar>
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
      .fetchQuery(queries.post.bySlug(category.slug, slug))
      .then((data) => {
        dataSetter(data)
        // toast.info('此文章访问的内容已过期，所以页面数据自动更新了。')
        console.log('Post data revalidated', data)
      })
  }, [category, dataSetter, isOutdated, queryClient, slug])
  return null
})
