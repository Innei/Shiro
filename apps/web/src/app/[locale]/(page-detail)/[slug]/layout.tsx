import { clsx } from 'clsx'
import type { Metadata } from 'next'


import { CommentAreaRootLazy } from '~/components/modules/comment'
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
import { CurrentPageDataProvider } from '~/providers/page/CurrentPageDataProvider'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import type { PageParams } from './api'
import { getData } from './api'
import {
  PageLoading,
  PagePaginator,
  PageSubTitle,
  PageTitle,
} from './pageExtra'

export const dynamic = 'force-dynamic'

export const generateMetadata = async (props: {
  params: Promise<PageParams>
}): Promise<Metadata> => {
  const params = await props.params
  const { slug } = params
  try {
    const data = await getData(slug)

    const { title, text } = data
    const description = getSummaryFromMd(text ?? '')

    const ogImage = await getOgUrl(
      'page',
      {
        slug,
      },
      params.locale,
    )

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

export default definePrerenderPage<PageParams>()({
  fetcher(params) {
    return getData(params.slug)
  },

  Component: ({ data, children }) => (
    <TocHeadingStrategyProvider
      contentFormat={data.contentFormat}
      content={data.content}
    >
      <CurrentPageDataProvider data={data} />
      <div className="relative flex min-h-[120px] w-full">
        <PageLoading>
          <div className="relative w-full min-w-0">
            <WrappedElementProvider eoaDetect>
              <article
                className={'prose'}
              >
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
        <CommentAreaRootLazy refId={data.id} allowComment={data.allowComment} />
      </BottomToUpSoftScaleTransitionView>

      <OnlyMobile>
        <TocFAB />
      </OnlyMobile>
    </TocHeadingStrategyProvider>
  ),
})
