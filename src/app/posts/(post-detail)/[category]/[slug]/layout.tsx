import React from 'react'
import type { Metadata } from 'next'

import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { attachUA } from '~/lib/attach-ua'
import { getSummaryFromMd } from '~/lib/markdown'
import { CurrentPostDataProvider } from '~/providers/post/CurrentPostDataProvider'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'
import { queries } from '~/queries/definition'
import { getQueryClient } from '~/utils/query-client.server'

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
  const data = await getQueryClient().fetchQuery(query)
  return (
    <>
      <CurrentPostDataProvider data={data} />
      <div className="relative flex min-h-[120px] grid-cols-[auto,200px] lg:grid">
        <BottomToUpTransitionView className="min-w-0">
          {props.children}
        </BottomToUpTransitionView>

        <LayoutRightSideProvider className="relative hidden lg:block" />
      </div>
    </>
  )
}
