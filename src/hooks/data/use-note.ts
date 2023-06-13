import { useQuery } from '@tanstack/react-query'

import { useCurrentNoteId } from '~/providers/note/current-note-id-provider'
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
  return useCurrentNoteId()
}

export const useNoteByNidQuery = (nid: string) => {
  return useQuery(queries.note.byNid(nid))
}
