import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import * as React from 'react'

import type { SelectValue } from '~/components/ui/select'
import { Select } from '~/components/ui/select'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { adminQueries } from '~/queries/definition'

import { SidebarSection } from '../../writing/SidebarBase'
import {
  usePostModelDataSelector,
  usePostModelSetModelData,
} from '../data-provider'

export const CategorySelector = () => {
  const { data, isLoading } = useQuery(adminQueries.post.allCategories())
  const categoryId = usePostModelDataSelector((data) => data?.categoryId)
  const setter = usePostModelSetModelData()
  const handleSelectionChange = useEventCallback((newCategoryId: string) => {
    if (newCategoryId === categoryId) return

    setter((prev) =>
      produce(prev, (draft) => {
        draft.categoryId = newCategoryId
      }),
    )
  })

  const selectValues: SelectValue<string>[] = (data?.data || []).map(
    (item) => ({
      label: item.name,
      value: item.id,
    }),
  )

  return (
    <SidebarSection label="分类">
      <Select<string>
        isLoading={isLoading}
        onChange={handleSelectionChange}
        values={selectValues}
        value={categoryId}
      />
    </SidebarSection>
  )
}
