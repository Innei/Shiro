'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { Loading } from '~/components/ui/loading'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { queries } from '~/queries/definition'
import { apiClient } from '~/utils/request'

import { Paper } from './Paper'

export default () => {
  const { data } = useQuery(
    ['note', 'latest'],
    async () => (await apiClient.note.getLatest()).$serialized,
    {
      cacheTime: 1,
    },
  )
  const queryClient = useQueryClient()
  const router = useRouter()
  const onceRef = useRef(false)
  useEffect(() => {
    if (!data) return
    if (onceRef.current) return

    queryClient.setQueryData(
      queries.note.byNid(data.data.nid.toString()).queryKey,
      data,
    )
    onceRef.current = true
    const id = setTimeout(() => {
      router.replace(
        routeBuilder(Routes.Note, {
          id: data.data.nid.toString(),
        }),
      )
    }, 1)
    return () => {
      clearTimeout(id)
    }
  }, [data])

  return (
    <Paper>
      <Loading useDefaultLoadingText />
    </Paper>
  )
}
