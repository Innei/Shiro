import { useInfiniteQuery } from '@tanstack/react-query'

import { apiClient } from '~/lib/request'

export const sayQueryKey = ['says']

export const useSayListQuery = () => {
  return useInfiniteQuery({
    queryKey: sayQueryKey,
    queryFn: async ({ pageParam }) => {
      const data = await apiClient.say.getAllPaginated(pageParam)
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  })
}
