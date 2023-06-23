import type { NoteModel } from '@mx-space/api-client'
import type { EventTypes } from '~/types/events'

import { setOnlineCount } from '~/atoms'
import { toast } from '~/lib/toast'
import {
  getCurrentNoteData,
  setCurrentNoteData,
} from '~/providers/note/CurrentNoteDataProvider'
import { isDev } from '~/utils/env'

export const eventHandler = (type: EventTypes, data: any) => {
  switch (type) {
    case 'VISITOR_ONLINE':
    case 'VISITOR_OFFLINE': {
      const { online } = data
      setOnlineCount(online)
      break
    }

    case 'NOTE_UPDATE': {
      const note = data as NoteModel
      if (getCurrentNoteData()?.data.id === note.id) {
        setCurrentNoteData((draft) => {
          Object.assign(draft.data, note)
        })
        toast('手记已更新')
      }
      break
    }

    default: {
      if (isDev) {
        console.log(type, data)
      }
    }
  }
}
