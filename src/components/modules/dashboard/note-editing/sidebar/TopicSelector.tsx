import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import * as React from 'react'

import type { SelectValue } from '~/components/ui/select'
import { Select } from '~/components/ui/select'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { adminQueries } from '~/queries/definition'

import { SidebarSection } from '../../writing/SidebarBase'
import {
  useNoteModelDataSelector,
  useNoteModelSetModelData,
} from '../data-provider'

export const TopicSelector = () => {
  const { data, isLoading } = useQuery(adminQueries.note.allTopic())
  const categoryId = useNoteModelDataSelector((data) => data?.topicId)
  const setter = useNoteModelSetModelData()
  const handleSelectionChange = useEventCallback((newCategoryId: string) => {
    if (newCategoryId === categoryId) return

    setter((prev) =>
      produce(prev, (draft) => {
        draft.topicId = newCategoryId
      }),
    )
  })

  const selectValues: SelectValue<string>[] = (data || []).map((item) => ({
    label: item.name,
    value: item.id,
  }))

  return (
    <SidebarSection label="专栏">
      <Select<string>
        isLoading={isLoading}
        onChange={handleSelectionChange}
        values={selectValues}
        value={categoryId}
      />
    </SidebarSection>
  )
}
