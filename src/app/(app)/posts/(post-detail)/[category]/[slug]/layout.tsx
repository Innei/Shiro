import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import type { PageParams } from './api'

import { buildRoomName, RoomProvider } from '~/components/modules/activity'
import { CommentAreaRootLazy } from '~/components/modules/comment'
import { TocFAB } from '~/components/modules/toc/TocFAB'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import { CurrentPostDataProvider } from '~/providers/post/CurrentPostDataProvider'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'

import { getData } from './api'

export const dynamic = 'force-dynamic'
export const generateMetadata = async ({
  params,
}: {
  params: PageParams
}): Promise<Metadata> => {
  const { slug } = params
  try {
    const data = await getData(params)
    const {
      title,
      category: { slug: categorySlug },
      text,
    } = data
    const description = getSummaryFromMd(text ?? '')

    const ogImage = getOgUrl('post', {
      category: categorySlug,
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

// eslint-disable-next-line react/display-name
export default async (props: NextPageParams<PageParams>) => {
  const data = await getData(props.params)

  return (
    <>
      <CurrentPostDataProvider data={data} />
      <div className="relative flex min-h-[120px] grid-cols-[auto,200px] lg:grid">
        <BottomToUpTransitionView lcpOptimization className="min-w-0">
          <RoomProvider roomName={buildRoomName(data.id)}>
            <Suspense>{props.children}</Suspense>
          </RoomProvider>

          <BottomToUpSoftScaleTransitionView delay={500}>
            <CommentAreaRootLazy
              refId={data.id}
              allowComment={data.allowComment}
            />
          </BottomToUpSoftScaleTransitionView>
        </BottomToUpTransitionView>

        <LayoutRightSideProvider className="relative hidden lg:block" />
      </div>

      <OnlyMobile>
        <TocFAB />
      </OnlyMobile>
    </>
  )
}
