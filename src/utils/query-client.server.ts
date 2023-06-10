import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})
export const getQueryClient = cache(() => queryClient)
