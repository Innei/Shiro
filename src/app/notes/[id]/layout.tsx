import { queries } from '~/queries/definition'
import { getQueryClient } from '~/utils/query-client.server'

export default async (
  props: NextPageParams<{
    id: string
  }>,
) => {
  await getQueryClient().fetchQuery(queries.note.byNid(props.params.id))
  return <>{props.children}</>
}
