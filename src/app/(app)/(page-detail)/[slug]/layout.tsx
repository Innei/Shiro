/* eslint-disable react/display-name */
import React from 'react'
import type { Metadata } from 'next'

import {
  buildRoomName,
  Presence,
  RoomProvider,
} from '~/components/modules/activity'
import { CommentAreaRootLazy } from '~/components/modules/comment'
import { TocFAB } from '~/components/modules/toc/TocFAB'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { attachUAAndRealIp } from '~/lib/attach-ua'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import { getQueryClient } from '~/lib/query-client.server'
import { requestErrorHandler } from '~/lib/request.server'
import { CurrentPageDataProvider } from '~/providers/page/CurrentPageDataProvider'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'
import { queries } from '~/queries/definition'

import {
  HeaderMetaInfoSetting,
  PageLoading,
  PagePaginator,
  PageSubTitle,
  PageTitle,
} from './pageExtra'

export const dynamic = 'force-dynamic'
const getData = async (params: PageParams) => {
  attachUAAndRealIp()
  const data = await getQueryClient()
    .fetchQuery(queries.page.bySlug(params.slug))
    .catch(requestErrorHandler)
  return data
}

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

export default async (props: NextPageParams<PageParams>) => {
  const data = await getData(props.params)
  return (
    <>
      <CurrentPageDataProvider data={data} />
      <div className="relative flex min-h-[120px] w-full">
        <PageLoading>
          <div className="relative w-full min-w-0">
            <HeaderMetaInfoSetting />

            <RoomProvider roomName={buildRoomName(data.id)}>
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
                    {props.children}
                  </BottomToUpTransitionView>

                  <Presence />
                </article>
              </WrappedElementProvider>
            </RoomProvider>

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
    </>
  )
}
