/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query'
import type { AggregateTop } from '@mx-space/api-client'

export const queryKey = ['home']

export const useHomeQueryData = () => {
  return useQuery({
    queryKey,
    queryFn: async () => null! as AggregateTop,
    enabled: false,
  }).data!
}
