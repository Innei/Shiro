import type { Metadata } from 'next'

import { queries } from '~/queries/definition'
import { getQueryClient } from '~/utils/query-client.server'

export const generateMetadata = async ({
  params,
}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  try {
    const { data } = await getQueryClient().fetchQuery(
      queries.note.byNid(params.id),
    )
    return {
      title: data.title,
    }
  } catch {
    return {}
  }
}

export default async (
  props: NextPageParams<{
    id: string
  }>,
) => {
  await getQueryClient().prefetchQuery(queries.note.byNid(props.params.id))
  return <>{props.children}</>
}
