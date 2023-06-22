import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { NoteModel, NoteWrappedPayload } from '@mx-space/api-client'
import type { UseQueryResult } from '@tanstack/react-query'

import { useCurrentNoteId } from '~/providers/note/CurrentNoteIdProvider'
import { queries } from '~/queries/definition'
import { isClientSide } from '~/utils/env'

export function useCurrentNoteData(): NoteModel
export function useCurrentNoteData<T>(
  select?: (data: NoteWrappedPayload) => T,
): T
export function useCurrentNoteData(select?: any) {
  const nid = useCurrentNoteId()

  if (!nid) {
    throw 'nid not ready'
  }

  const searchParams = useMemo(
    () => (isClientSide ? new URLSearchParams(location.search) : null),
    [nid],
  )
  const password = searchParams?.get('password')
  const queryClient = useQueryClient()
  const query = queries.note.byNid(nid, password!)
  const key = query.queryKey

  const { data: noteAggregation } = useQuery({
    ...query,
    // enabled: nid,
    select(data) {
      if (typeof select === 'function') return select(data)
      return data.data
    },
    initialData: queryClient.getQueryData(key),
    keepPreviousData: true,
  })

  return noteAggregation
}

export function useNoteByNidQuery(
  nid: string,
): UseQueryResult<NoteWrappedPayload>
export function useNoteByNidQuery<T>(
  nid: string,
  select?: (data: NoteWrappedPayload) => T,
): UseQueryResult<T>
export function useNoteByNidQuery(nid: string, select?: any) {
  const searchParams = useMemo(
    () => (isClientSide ? new URLSearchParams(location.search) : null),
    [nid],
  )
  const password = searchParams?.get('password')
  const key = queries.note.byNid(nid, password!).queryKey
  const queryClient = useQueryClient()

  return useQuery({
    ...queries.note.byNid(nid, password!),
    enabled: !!nid,
    initialData: queryClient.getQueryData(key),
    select,
  })
}
