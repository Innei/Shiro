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
import { CurrentPostDataProvider } from '~/providers/post/CurrentPostDataProvider'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'
import { queries } from '~/queries/definition'

import PostPage from './pageImpl'

export const generateMetadata = async ({
  params,
}: {
  params: PageParams
}): Promise<Metadata> => {
  const { category, slug } = params
  try {
    attachUAAndRealIp()
    const data = await getQueryClient().fetchQuery(
      queries.post.bySlug(category, slug),
    )
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
  attachUAAndRealIp()
  const {
    params: { category, slug },
  } = props
  const query = queries.post.bySlug(category, slug)
  // const queryKey = query.queryKey
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
