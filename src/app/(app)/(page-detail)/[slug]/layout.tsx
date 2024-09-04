import type { Metadata } from 'next'
import React, { cache } from 'react'

import { CommentAreaRootLazy } from '~/components/modules/comment'
import { TocFAB } from '~/components/modules/toc/TocFAB'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { attachServerFetch } from '~/lib/attach-fetch'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import { apiClient } from '~/lib/request'
import { definePrerenderPage, requestErrorHandler } from '~/lib/request.server'
import { CurrentPageDataProvider } from '~/providers/page/CurrentPageDataProvider'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import {
  HeaderMetaInfoSetting,
  PageLoading,
  PagePaginator,
  PageSubTitle,
  PageTitle,
} from './pageExtra'

export const dynamic = 'force-dynamic'
const getData = cache(async (params: PageParams) => {
  attachServerFetch()
  const data = await apiClient.page
    .getBySlug(params.slug)
    .catch(requestErrorHandler)
  return data.$serialized
})

export const generateMetadata = async ({
  params,
}: {
  params: PageParams
}): Promise<Metadata> => {
  const { slug } = params
  try {
    const data = await getData(params)

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

export default definePrerenderPage<PageParams>()({
  fetcher(params) {
    return getData(params)
  },

  Component: ({ data, children }) => {
    return (
      <>
        <CurrentPageDataProvider data={data} />
        <div className="relative flex min-h-[120px] w-full">
          <PageLoading>
            <div className="relative w-full min-w-0">
              <HeaderMetaInfoSetting />

              <WrappedElementProvider eoaDetect>
                <article className="prose">
                  <header className="mb-8">
                    <BottomToUpSoftScaleTransitionView
                      lcpOptimization
                      delay={0}
                    >
                      <PageTitle />
                    </BottomToUpSoftScaleTransitionView>

                    <BottomToUpSoftScaleTransitionView
                      lcpOptimization
                      delay={200}
                    >
                      <PageSubTitle />
                    </BottomToUpSoftScaleTransitionView>
                  </header>
                  <BottomToUpTransitionView lcpOptimization delay={600}>
                    {children}
                  </BottomToUpTransitionView>
                </article>
              </WrappedElementProvider>

              <BottomToUpSoftScaleTransitionView delay={1000}>
                <PagePaginator />
              </BottomToUpSoftScaleTransitionView>
            </div>
          </PageLoading>

          <LayoutRightSideProvider className="absolute inset-y-0 right-0 hidden translate-x-full lg:block" />
        </div>
        <BottomToUpSoftScaleTransitionView delay={1000}>
          <CommentAreaRootLazy
            refId={data.id}
            allowComment={data.allowComment}
          />
        </BottomToUpSoftScaleTransitionView>

        <OnlyMobile>
          <TocFAB />
        </OnlyMobile>
      </>
    )
  },
})
