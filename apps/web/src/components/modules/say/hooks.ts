import type { SayModel } from '@mx-space/api-client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { createElement, useCallback } from 'react'

import { useModalStack } from '~/components/ui/modal'
import { apiClient } from '~/lib/request'

import { SayModalForm } from './SayModalForm'

export const sayQueryKey = ['says']

export const useSayListQuery = () =>
  useInfiniteQuery({
    queryKey: sayQueryKey,
    queryFn: async ({ pageParam }) => {
      const data = await apiClient.say.getAllPaginated(pageParam)
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  })

export const useSayModal = () => {
  const { present } = useModalStack()
  const t = useTranslations('says')

  return useCallback(
    (editingData?: SayModel) => {
      present({
        title: editingData ? t('edit_say') : t('publish_say'),
        content: () => createElement(SayModalForm, { editingData }),
        modalClassName: 'w-[500px]',
      })
    },
    [present, t],
  )
}
