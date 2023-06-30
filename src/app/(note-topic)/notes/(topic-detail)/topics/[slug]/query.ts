import { defineQuery } from '~/queries/helper'
import { apiClient } from '~/utils/request'

export const getTopicQuery = (topicSlug: string) =>
  defineQuery({
    queryKey: ['topic', topicSlug],
    queryFn: async ({ queryKey }) => {
      const [_, slug] = queryKey
      return (await apiClient.topic.getTopicBySlug(slug)).$serialized
    },
  })
