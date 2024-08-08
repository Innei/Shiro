import type { AggregateTop } from '@mx-space/api-client'
import { useQuery } from '@tanstack/react-query'

export const queryKey = ['home']

export const useHomeQueryData = () => {
  return useQuery({
    queryKey,
    queryFn: async () => null! as AggregateTop,
    enabled: false,
  }).data!
}
