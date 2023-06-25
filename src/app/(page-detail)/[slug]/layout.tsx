import React from 'react'
import { headers } from 'next/dist/client/components/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { RequestError } from '@mx-space/api-client'

import { NotSupport } from '~/components/common/NotSupport'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { CommentRoot } from '~/components/widgets/comment/CommentRoot'
import { REQUEST_GEO } from '~/constants/system'
import { attachUA } from '~/lib/attach-ua'
import { getSummaryFromMd } from '~/lib/markdown'
import { CurrentPageDataProvider } from '~/providers/page/CurrentPageDataProvider'
import { LayoutRightSideProvider } from '~/providers/shared/LayoutRightSideProvider'
import { queries } from '~/queries/definition'
import { getQueryClient } from '~/utils/query-client.server'

import { Container } from './Container'

export const generateMetadata = async ({
  params,
}: {
  params: PageParams
}): Promise<Metadata> => {
  const { slug } = params
  try {
    attachUA()
    const data = await getQueryClient().fetchQuery(queries.page.bySlug(slug))
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
  slug: string
}

export default async (props: NextPageParams<PageParams>) => {
  attachUA()
  const {
    params: { slug },
  } = props
  const query = queries.page.bySlug(slug)
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
    <Container>
      <CurrentPageDataProvider data={data} />
      <div className="relative flex min-h-[120px]">
        <BottomToUpTransitionView className="min-w-0">
          {props.children}
        </BottomToUpTransitionView>

        <LayoutRightSideProvider className="absolute bottom-0 right-0 top-0 hidden translate-x-full lg:block" />
      </div>
      {isCN ? <NotSupport /> : <CommentRoot refId={data.id} />}
    </Container>
  )
}
