import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { RequestError } from '@mx-space/api-client'

import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition/BottomToUpSoftScaleTransitionView'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { CommentAreaRootLazy } from '~/components/widgets/comment'
import { TocFAB } from '~/components/widgets/toc/TocFAB'
import { attachUAAndRealIp } from '~/lib/attach-ua'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import { getQueryClient } from '~/lib/query-client.server'
import { CurrentPageDataProvider } from '~/providers/page/CurrentPageDataProvider'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'
import { queries } from '~/queries/definition'

import {
  HeaderMetaInfoSetting,
  PageLoading,
  PagePaginator,
  PageSubTitle,
  PageTitle,
} from './pageExtra'

export const generateMetadata = async ({
  params,
}: {
  params: PageParams
}): Promise<Metadata> => {
  const { slug } = params
  try {
    attachUAAndRealIp()
    const data = await getQueryClient().fetchQuery(queries.page.bySlug(slug))
    const { title, text } = data
    const description = getSummaryFromMd(text ?? '')

    const ogImage = getOgUrl('page', {
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
    } satisfies Metadata
  } catch {
    return {}
  }
}

interface PageParams {
  slug: string
}

export default async (props: NextPageParams<PageParams>) => {
  attachUAAndRealIp()
  const {
    params: { slug },
  } = props

  if (!slug) return notFound()
  const query = queries.page.bySlug(slug)
  const data = await getQueryClient()
    .fetchQuery(query)
    .catch((error) => {
      if (error instanceof RequestError && error.status === 404) {
        return notFound()
      }
      throw error
    })

  return (
    <>
      <CurrentPageDataProvider data={data} />
      <div className="relative flex min-h-[120px] w-full">
        <PageLoading>
          <div className="relative w-full min-w-0">
            <HeaderMetaInfoSetting />
            <article className="prose">
              <header className="mb-8">
                <BottomToUpSoftScaleTransitionView lcpOptimization delay={0}>
                  <PageTitle />
                </BottomToUpSoftScaleTransitionView>

                <BottomToUpSoftScaleTransitionView lcpOptimization delay={200}>
                  <PageSubTitle />
                </BottomToUpSoftScaleTransitionView>
              </header>
              <BottomToUpTransitionView lcpOptimization delay={600}>
                {props.children}
              </BottomToUpTransitionView>
            </article>

            <BottomToUpSoftScaleTransitionView delay={1000}>
              <PagePaginator />
            </BottomToUpSoftScaleTransitionView>
          </div>
        </PageLoading>

        <LayoutRightSideProvider className="absolute bottom-0 right-0 top-0 hidden translate-x-full lg:block" />
      </div>
      <BottomToUpSoftScaleTransitionView delay={1000}>
        <CommentAreaRootLazy refId={data.id} allowComment={data.allowComment} />
      </BottomToUpSoftScaleTransitionView>

      <OnlyMobile>
        <TocFAB />
      </OnlyMobile>
    </>
  )
}
