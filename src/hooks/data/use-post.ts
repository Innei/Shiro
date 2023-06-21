import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { queries } from '~/queries/definition'

export const useCurrentPostData = () => {
  const { category, slug } = useParams()

  const { data } = useQuery({
    ...queries.post.bySlug(category, slug),
    enabled: !(category && slug),

    keepPreviousData: true,
  })

  return data
}
