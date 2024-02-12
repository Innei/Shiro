import { resetActivityPresence } from '~/atoms/activity'
import { apiClient } from '~/lib/request'

import { defineQuery } from '../helper'

export const activity = {
  presence: (roomName: string) =>
    defineQuery({
      queryKey: ['activity', 'presence', roomName],
      queryFn: async () => {
        const res = await apiClient.activity.getPresence(roomName)
        resetActivityPresence(res)
        return res
      },
    }),
}
