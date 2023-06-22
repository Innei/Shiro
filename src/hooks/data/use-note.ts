import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { NoteWrappedPayload } from '@mx-space/api-client'
import type { UseQueryResult } from '@tanstack/react-query'

import { queries } from '~/queries/definition'
import { isClientSide } from '~/utils/env'

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
