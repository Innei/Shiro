import { apiClient } from '~/lib/request.new'
import { defineQuery } from '~/queries/helper'

export const topicsQuery = defineQuery({
  queryKey: ['topic'],
  queryFn: async () => {
    return (await apiClient.topic.getAll()).data
  },
})
