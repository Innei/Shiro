import RemoveMarkdown from 'remove-markdown'
import type { Metadata } from 'next'

import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { attachUA } from '~/lib/attach-ua'
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
    const { title, images } = data
    const description = RemoveMarkdown(data.text).slice(0, 100)
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
  await getQueryClient().prefetchQuery(queries.note.byNid(props.params.id))
  return (
    <BottomToUpTransitionView>
      <Paper>{props.children}</Paper>
    </BottomToUpTransitionView>
  )
}
