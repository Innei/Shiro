'use client'

import { useEffect } from 'react'
import { Balancer } from 'react-wrap-balancer'
import type { Image } from '@mx-space/api-client'
import type { PropsWithChildren } from 'react'

import { ClientOnly } from '~/components/common/ClientOnly'
import { ReadIndicator } from '~/components/common/ReadIndicator'
import { useSetHeaderMetaInfo } from '~/components/layout/header/hooks'
import { Markdown } from '~/components/ui/markdown'
import { PostActionAside } from '~/components/widgets/post/PostActionAside'
import { PostCopyright } from '~/components/widgets/post/PostCopyright'
import { PostMetaBar } from '~/components/widgets/post/PostMetaBar'
import { SubscribeBell } from '~/components/widgets/subscribe/SubscribeBell'
import { TocAside, TocAutoScroll } from '~/components/widgets/toc'
import { XLogInfoForPost, XLogSummaryForPost } from '~/components/widgets/xlog'
import { noopArr } from '~/lib/noop'
import { MarkdownImageRecordProvider } from '~/providers/article/MarkdownImageRecordProvider'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import Loading from './loading'

const PostPage = () => {
  const id = useCurrentPostDataSelector((p) => p?.id)
  const title = useCurrentPostDataSelector((p) => p?.title)
  if (!id) {
    return <Loading />
  }

  return (
    <div>
      <HeaderMetaInfoSetting />
      <article className="prose">
        <header className="mb-8">
          <h1 className="text-center">
            <Balancer>{title}</Balancer>
          </h1>

          <PostMetaBarInternal className="mb-8 justify-center" />

          <XLogSummaryForPost />
        </header>
        <WrappedElementProvider>
          <PostMarkdownImageRecordProvider>
            <PostMarkdown />
          </PostMarkdownImageRecordProvider>

          <LayoutRightSidePortal>
            <TocAside
              className="sticky top-[120px] ml-4 mt-[120px]"
              treeClassName="max-h-[calc(100vh-6rem-4.5rem-300px)] h-[calc(100vh-6rem-4.5rem-300px)] min-h-[120px] relative"
              accessory={ReadIndicator}
            >
              <PostActionAside className="translate-y-full" />
            </TocAside>
            <TocAutoScroll />
          </LayoutRightSidePortal>
        </WrappedElementProvider>
      </article>

      <ClientOnly>
        <PostCopyright />
        <SubscribeBell defaultType="post_c" />
        <XLogInfoForPost />
      </ClientOnly>
    </div>
  )
}

const PostMarkdown = () => {
  const text = useCurrentPostDataSelector((data) => data?.text)
  if (!text) return null

  return <Markdown value={text} as="main" className="min-w-0 overflow-hidden" />
}
const PostMarkdownImageRecordProvider = (props: PropsWithChildren) => {
  const images = useCurrentPostDataSelector(
    (data) => data?.images || (noopArr as Image[]),
  )
  if (!images) return null

  return (
    <MarkdownImageRecordProvider images={images}>
      {props.children}
    </MarkdownImageRecordProvider>
  )
}

const HeaderMetaInfoSetting = () => {
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

const PostMetaBarInternal: Component = ({ className }) => {
  const meta = useCurrentPostDataSelector((data) => {
    if (!data) return
    return {
      created: data.created,
      category: data.category,
      tags: data.tags,
      count: data.count,
    }
  })
  if (!meta) return null
  return <PostMetaBar meta={meta} className={className} />
}

export default PostPage
