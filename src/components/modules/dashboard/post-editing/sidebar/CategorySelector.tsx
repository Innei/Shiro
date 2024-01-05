import { Select, SelectItem } from '@nextui-org/react'
import React, { useMemo } from 'react'
import { produce } from 'immer'
import { useEventCallback } from 'usehooks-ts'
import type { Selection } from '@nextui-org/react'

import { useI18n } from '~/i18n/hooks'
import { trpc } from '~/lib/trpc'

import {
  usePostModelDataSelector,
  usePostModelSetModelData,
} from '../data-provider'

export const CategorySelector = () => {
  const t = useI18n()
  const { data = [], isLoading } = trpc.category.getAllForSelector.useQuery()
  const categoryId = usePostModelDataSelector((data) => data?.categoryId)
  const setter = usePostModelSetModelData()
  const handleSelectionChange = useEventCallback((value: Selection) => {
    const newCategoryId = Array.from(new Set(value).values())[0] as string
    if (newCategoryId === categoryId) return

    setter((prev) => {
      return produce(prev, (draft) => {
        draft.categoryId = newCategoryId
      })
    })
  })
  return (
    <div className="flex flex-col space-y-3">
      <Select
        className="mt-5"
        label={t('common.category')}
        labelPlacement="outside"
        isLoading={isLoading}
        selectedKeys={useMemo(() => new Set([categoryId]), [categoryId])}
        onSelectionChange={handleSelectionChange}
        variant="flat"
        size="sm"
      >
        {data?.map((item) => (
          <SelectItem key={item.id} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  )
}
