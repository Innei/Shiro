import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // cacheTime: 0,
    },
  },
})
export const getQueryClient = cache(() => queryClient)
