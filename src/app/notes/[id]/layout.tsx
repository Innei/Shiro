import { headers } from 'next/dist/client/components/headers'
import type { Metadata } from 'next'

import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { REQUEST_QUERY } from '~/constants/system'
import { attachUA } from '~/lib/attach-ua'
import { getSummaryFromMd } from '~/lib/markdown'
import { queries } from '~/queries/definition'
import { getQueryClient } from '~/utils/query-client.server'

import { Paper } from '../Paper'

export const generateMetadata = async ({
  params,
}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  try {
    attachUA()
    const { data } = await getQueryClient().fetchQuery(
      queries.note.byNid(params.id),
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

export default async (
  props: NextPageParams<{
    id: string
  }>,
) => {
  attachUA()
  const searchParams = new URLSearchParams(headers().get(REQUEST_QUERY) || '')

  await getQueryClient().fetchQuery(
    queries.note.byNid(
      props.params.id,
      searchParams.get('password') || undefined,
    ),
  )
  return (
    <BottomToUpTransitionView>
      <Paper>{props.children}</Paper>
    </BottomToUpTransitionView>
  )
}
