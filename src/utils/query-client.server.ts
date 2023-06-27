import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 3,
      cacheTime: 1000 * 3,
    },
  },
})
export const getQueryClient = cache(() => queryClient)
