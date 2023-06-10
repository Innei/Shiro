import { useQuery } from '@tanstack/react-query'

import { queries } from '../definition'

export const useNoteByNidQuery = (nid: string) => {
  return useQuery(queries.note.byNid(nid))
}
