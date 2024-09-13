'use client'

import { RequestError } from '@mx-space/api-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createStore, del, get, set } from 'idb-keyval'
import type { PropsWithChildren } from 'react'
import { useState } from 'react'

import { isServerSide } from '~/lib/env'

const dbStore = isServerSide ? undefined : createStore('react-query', 'queries')

const asyncStoragePersister = createAsyncStoragePersister({
  storage: {
    getItem: async (key) => {
      const value = await get(key, dbStore)
      return value
    },
    setItem: async (key, value) => {
      await set(key, value, dbStore)
    },
    removeItem: async (key) => {
      await del(key, dbStore)
    },
  },
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
})

declare module '@tanstack/react-query' {
  interface Meta {
    queryMeta: { persist?: boolean }
  }

  interface Register extends Meta {}
}

const persistOptions: Omit<PersistQueryClientOptions, 'queryClient'> = {
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      const queryIsReadyForPersistence = query.state.status === 'success'

      if (query.meta?.persist === false) return false

      if (queryIsReadyForPersistence) {
        return (
          !((query.state?.data as any)?.pages?.length > 1) ||
          (!!query.state.data && !(query.state.data as any).pages)
        )
      } else {
        return false
      }
    },
  },
}
export const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      {children}
    </PersistQueryClientProvider>
  )
}

export const getQueryClientForDashboard = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: false,
        refetchOnMount: true,
        retry(failureCount, error) {
          if (error instanceof RequestError && error.status === 401)
            return false
          return failureCount < 3
        },
      },
    },
  })

export const ReactQueryProviderForDashboard = ({
  children,
}: PropsWithChildren) => {
  return (
    <QueryClientProvider client={useState(getQueryClientForDashboard)[0]}>
      {children}
    </QueryClientProvider>
  )
}
