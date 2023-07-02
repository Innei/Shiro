import React from 'react'
import { headers } from 'next/dist/client/components/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { RequestError } from '@mx-space/api-client'

import { NotSupport } from '~/components/common/NotSupport'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition/BottomToUpSoftScaleTransitionView'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { CommentAreaRoot } from '~/components/widgets/comment'
import { REQUEST_GEO } from '~/constants/system'
import { attachUA } from '~/lib/attach-ua'
import { getSummaryFromMd } from '~/lib/markdown'
import { getQueryClient } from '~/lib/query-client.server'
import { CurrentPostDataProvider } from '~/providers/post/CurrentPostDataProvider'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'
import { queries } from '~/queries/definition'

export const generateMetadata = async ({
  params,
}: {
  params: PageParams
}): Promise<Metadata> => {
  const { category, slug } = params
  try {
    attachUA()
    const data = await getQueryClient().fetchQuery(
      queries.post.bySlug(category, slug),
    )
    const { title, images, text } = data
    const description = getSummaryFromMd(text ?? '')

    const ogImage = images?.length
      ? {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          url: images[0].src!,
        }
      : undefined
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
  attachUA()
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
  const header = headers()
  const geo = header.get(REQUEST_GEO)

  const isCN = geo === 'CN'

  return (
    <>
      <CurrentPostDataProvider data={data} />
      <div className="relative flex min-h-[120px] grid-cols-[auto,200px] lg:grid">
        <BottomToUpTransitionView className="min-w-0">
          {props.children}

          <BottomToUpSoftScaleTransitionView delay={500}>
            {isCN ? (
              <NotSupport />
            ) : (
              <CommentAreaRoot
                refId={data.id}
                allowComment={data.allowComment}
              />
            )}
          </BottomToUpSoftScaleTransitionView>
        </BottomToUpTransitionView>

        <LayoutRightSideProvider className="relative hidden lg:block" />
      </div>
    </>
  )
}
