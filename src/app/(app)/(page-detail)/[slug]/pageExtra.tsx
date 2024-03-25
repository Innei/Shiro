'use client'

import { Fragment, useEffect, useMemo } from 'react'
import Link from 'next/link'
import type { Image } from '@mx-space/api-client'
import type { PropsWithChildren } from 'react'

import { useSetHeaderMetaInfo } from '~/components/layout/header/hooks'
import { GoToAdminEditingButton } from '~/components/modules/shared/GoToAdminEditingButton'
import { WithArticleSelectionAction } from '~/components/modules/shared/WithArticleSelectionAction'
import { MainMarkdown } from '~/components/ui/markdown'
import { noopArr } from '~/lib/noop'
import { MarkdownImageRecordProvider } from '~/providers/article/MarkdownImageRecordProvider'
import { useCurrentPageDataSelector } from '~/providers/page/CurrentPageDataProvider'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import Loading from './loading'

export const PageLoading: Component = ({ children }) => {
  const id = useCurrentPageDataSelector((p) => p?.id)

  if (!id) {
    return <Loading />
  }

  return children
}

export const PageMarkdown = () => {
  const text = useCurrentPageDataSelector((data) => data?.text)
  if (!text) return null

  return (
    <MainMarkdown
      allowsScript
      value={text}
      className="min-w-0 overflow-hidden"
    />
  )
}
export const MarkdownImageRecordProviderInternal = (
  props: PropsWithChildren,
) => {
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

export const PageSubTitle = () => {
  const subtitle = useCurrentPageDataSelector((data) => data?.subtitle)
  return (
    <p className="text-center text-lg text-gray-600/70 dark:text-neutral-400 lg:text-left">
      {subtitle}
    </p>
  )
}
export const PageTitle = () => {
  const title = useCurrentPageDataSelector((data) => data?.title)
  const id = useCurrentPageDataSelector((data) => data?.id)
  return (
    <>
      <h1 className="text-balance text-center lg:text-left">{title}</h1>
      <GoToAdminEditingButton
        id={id!}
        type="pages"
        className="absolute -top-6 right-0"
      />
    </>
  )
}
export const HeaderMetaInfoSetting = () => {
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

export const PagePaginator = () => {
  const currentPageTitle = useCurrentPageDataSelector((d) => d?.title)
  const pageMeta = useAggregationSelector((d) => d.pageMeta)
  const pages = useMemo(() => pageMeta || [], [pageMeta])
  const indexInPages = pages.findIndex((i) => i.title == currentPageTitle)
  const n = pages.length
  const hasNext = indexInPages + 1 < n
  const hasPrev = indexInPages - 1 >= 0
  return (
    <div
      className="relative mt-8 grid h-20 select-none grid-cols-2"
      data-hide-print
    >
      <div className="justify-start">
        {hasPrev && (
          <Fragment>
            <Link
              href={`/${pages[indexInPages - 1].slug}`}
              className="flex flex-col justify-end text-left leading-loose"
            >
              <span className="text-accent">回顾一下：</span>
              <span>{pages[indexInPages - 1].title}</span>
            </Link>
          </Fragment>
        )}
      </div>
      <div className="justify-end">
        {hasNext && (
          <Fragment>
            <Link
              href={`/${pages[indexInPages + 1].slug}`}
              className="flex flex-col justify-end text-right leading-loose"
            >
              <span className="text-accent">继续了解：</span>
              <span>{pages[indexInPages + 1].title}</span>
            </Link>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export const MarkdownSelection: Component = (props) => {
  const id = useCurrentPageDataSelector((data) => data?.id)!
  const title = useCurrentPageDataSelector((data) => data?.title)!
  const canComment = useCurrentPageDataSelector((data) => data?.allowComment)!
  return (
    <WithArticleSelectionAction
      refId={id}
      title={title}
      canComment={canComment}
    >
      {props.children}
    </WithArticleSelectionAction>
  )
}
