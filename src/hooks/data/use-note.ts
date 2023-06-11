import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { queries } from '~/queries/definition'

export const useNoteData = () => {
  const nid = useNoteNId()
  const { data: noteAggregation } = useQuery({
    ...queries.note.byNid(nid || ''),
    enabled: nid !== undefined,
    select(data) {
      return data.data
    },
    keepPreviousData: true,
  })

  return noteAggregation
}

export const useNoteNId = () => {
  return (useParams() as { id?: string }).id
}

export const useNoteByNidQuery = (nid: string) => {
  return useQuery(queries.note.byNid(nid))
}
