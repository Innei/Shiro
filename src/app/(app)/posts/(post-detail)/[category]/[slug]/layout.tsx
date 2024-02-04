import React from 'react'
import type { Metadata } from 'next'

import { CommentAreaRootLazy } from '~/components/modules/comment'
import { TocFAB } from '~/components/modules/toc/TocFAB'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition/BottomToUpSoftScaleTransitionView'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { attachUAAndRealIp } from '~/lib/attach-ua'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import { getQueryClient } from '~/lib/query-client.server'
import { requestErrorHandler } from '~/lib/request.server'
import { CurrentPostDataProvider } from '~/providers/post/CurrentPostDataProvider'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'
import { queries } from '~/queries/definition'

import PostPage from './pageImpl'

const getData = async (params: PageParams) => {
  const { category, slug } = params
  attachUAAndRealIp()
  const data = await getQueryClient()
    .fetchQuery(queries.post.bySlug(category, slug))
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

interface PageParams {
  category: string
  slug: string
}

export default async (props: NextPageParams<PageParams>) => {
  const data = await getData(props.params)

  return (
    <>
      <CurrentPostDataProvider data={data} />
      <div className="relative flex min-h-[120px] grid-cols-[auto,200px] lg:grid">
        <BottomToUpTransitionView lcpOptimization className="min-w-0">
          <PostPage {...data} />

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
