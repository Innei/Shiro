'use client'

import { useEffect } from 'react'
import { Balancer } from 'react-wrap-balancer'
import type { Image } from '@mx-space/api-client'
import type { PropsWithChildren } from 'react'

import { useSetHeaderMetaInfo } from '~/components/layout/header/hooks'
import { Markdown } from '~/components/ui/markdown'
import { TocAside, TocAutoScroll } from '~/components/widgets/toc'
import { noopArr } from '~/lib/noop'
import { MarkdownImageRecordProvider } from '~/providers/article/MarkdownImageRecordProvider'
import { useCurrentPageDataSelector } from '~/providers/page/CurrentPageDataProvider'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import Loading from './loading'

const PageDetail = () => {
  const id = useCurrentPageDataSelector((p) => p?.id)
  const title = useCurrentPageDataSelector((p) => p?.title)
  const subtitle = useCurrentPageDataSelector((p) => p?.subtitle)
  if (!id) {
    return <Loading />
  }

  return (
    <div>
      <HeaderMetaInfoSetting />
      <article className="prose">
        <header className="mb-8">
          <h1 className="text-center lg:text-left">
            <Balancer>{title}</Balancer>
          </h1>

          <desc className="text-center text-lg text-gray-600/70 dark:text-neutral-400 lg:text-left">
            {subtitle}
          </desc>
        </header>
        <WrappedElementProvider>
          <MarkdownImageRecordProviderInternal>
            <PostMarkdown />
          </MarkdownImageRecordProviderInternal>

          <LayoutRightSidePortal>
            <TocAside
              className="sticky top-[120px] ml-4 mt-[120px]"
              treeClassName="max-h-[calc(100vh-6rem-4.5rem-300px)] h-[calc(100vh-6rem-4.5rem-300px)] min-h-[120px] relative"
            />
            <TocAutoScroll />
          </LayoutRightSidePortal>
        </WrappedElementProvider>
      </article>
    </div>
  )
}

const PostMarkdown = () => {
  const text = useCurrentPageDataSelector((data) => data?.text)
  if (!text) return null

  return <Markdown value={text} as="main" className="min-w-0 overflow-hidden" />
}
const MarkdownImageRecordProviderInternal = (props: PropsWithChildren) => {
  const images = useCurrentPageDataSelector(
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
  const meta = useCurrentPageDataSelector((data) => {
    if (!data) return null

    return {
      title: data.title,
      description: data.subtitle || '',
      slug: `/${data.slug}`,
    }
  })

  useEffect(() => {
    if (meta) setHeaderMetaInfo(meta)
  }, [meta])

  return null
}

export default PageDetail
