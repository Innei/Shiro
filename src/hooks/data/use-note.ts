import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useCurrentNoteId } from '~/providers/note/CurrentNoteIdProvider'
import { queries } from '~/queries/definition'
import { isClientSide } from '~/utils/env'

export const useCurrentNoteData = () => {
  const nid = useCurrentNoteNId()

  const searchParams = useMemo(
    () => (isClientSide ? new URLSearchParams(location.search) : null),
    [nid],
  )
  const password = searchParams?.get('password')
  const { data: noteAggregation } = useQuery({
    ...queries.note.byNid(nid || '', password!),
    enabled: !!nid,
    select(data) {
      return data.data
    },
    keepPreviousData: true,
  })

  return noteAggregation
}

export const useCurrentNoteNId = () => {
  return useCurrentNoteId()
}

export const useNoteByNidQuery = (nid: string) => {
  const searchParams = useMemo(
    () => (isClientSide ? new URLSearchParams(location.search) : null),
    [nid],
  )
  const password = searchParams?.get('password')
  return useQuery({
    ...queries.note.byNid(nid, password!),
    enabled: !!nid,
  })
}
