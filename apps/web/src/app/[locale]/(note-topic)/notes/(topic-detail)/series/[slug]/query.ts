import { apiClient } from '~/lib/request'
import { defineQuery } from '~/queries/helper'

export const getTopicQuery = (topicSlug: string) =>
  defineQuery({
    queryKey: ['topic', topicSlug],
    queryFn: async ({ queryKey }) => {
      const [_, slug] = queryKey
      return (await apiClient.topic.getTopicBySlug(slug)).$serialized
    },
  })
