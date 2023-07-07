'use client'

import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useRef } from 'react'
import { del, get, set } from 'idb-keyval'
import type {
  PersistedClient,
  Persister,
  PersistQueryClientOptions,
} from '@tanstack/react-query-persist-client'
import type { PropsWithChildren } from 'react'

const idbValidKey = 'reactQuery'
const persister = {
  persistClient: async (client: PersistedClient) => {
    set(idbValidKey, client)
  },
  restoreClient: async () => {
    return await get<PersistedClient>(idbValidKey)
  },
  removeClient: async () => {
    await del(idbValidKey)
  },
} as Persister

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes

      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
})
export const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={
        useRef<Omit<PersistQueryClientOptions, 'queryClient'>>({
          persister,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              const queryIsReadyForPersistance =
                query.state.status === 'success'

              if (query.meta?.persist === false) return false

              if (queryIsReadyForPersistance) {
                return !((query.state?.data as any)?.pages?.length > 1)
              } else {
                return false
              }
            },
          },
        }).current
      }
    >
      {children}
    </PersistQueryClientProvider>
  )
}
