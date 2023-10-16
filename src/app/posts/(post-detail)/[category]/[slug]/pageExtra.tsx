'use client'

import { useEffect } from 'react'
import Balancer from 'react-wrap-balancer'
import type { Image } from '@mx-space/api-client'
import type { PropsWithChildren } from 'react'

import { useSetHeaderMetaInfo } from '~/components/layout/header/hooks'
import { MainMarkdown } from '~/components/ui/markdown'
import { PostMetaBar } from '~/components/widgets/post/PostMetaBar'
import { WithArticleSelectionAction } from '~/components/widgets/shared/WithArticleSelectionAction'
import { noopArr } from '~/lib/noop'
import { MarkdownImageRecordProvider } from '~/providers/article/MarkdownImageRecordProvider'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'

export const PostTitle = () => {
  const title = useCurrentPostDataSelector((data) => data?.title)!

  return (
    <h1 className="text-center">
      <Balancer>{title}</Balancer>
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
  return <PostMetaBar meta={meta} className={className} />
}
