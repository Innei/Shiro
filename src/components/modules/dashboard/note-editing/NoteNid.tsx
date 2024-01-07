import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { useNoteModelSingleFieldAtom } from './data-provider'

export const NoteNid = () => {
  const webUrl = location.origin

  const [nid] = useNoteModelSingleFieldAtom('nid')

  const latestNid = useAggregationSelector((s) => s.latestNoteId)

  return (
    <label className="text-base-content">{`${webUrl}/notes/${
      nid || (latestNid?.nid ? latestNid.nid + 1 : '')
    }`}</label>
  )
}
