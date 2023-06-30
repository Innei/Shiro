import { defineQuery } from '~/queries/helper'
import { apiClient } from '~/utils/request'

export const topicsQuery = defineQuery({
  queryKey: ['topic'],
  queryFn: async () => {
    return (await apiClient.topic.getAll()).data
  },
})
