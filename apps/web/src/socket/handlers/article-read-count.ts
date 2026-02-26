import {
  getCurrentNoteData,
  setCurrentNoteData,
} from '~/providers/note/CurrentNoteDataProvider'
import {
  getGlobalCurrentPostData,
  setGlobalCurrentPostData,
} from '~/providers/post/CurrentPostDataProvider'
import { EventTypes } from '~/types/events'

import type { EventHandler } from './types'

export const articleReadCountUpdateHandler: EventHandler = (data) => {
  const { id, count, type } = data
  if (!count) return

  switch (type) {
    case 'post': {
      const currentData = getGlobalCurrentPostData()
      if (currentData?.id === id) {
        setGlobalCurrentPostData((draft) => {
          draft.count.read = count
        })
      }
      break
    }
    case 'note': {
      const currentData = getCurrentNoteData()?.data
      if (currentData?.id === id) {
        setCurrentNoteData((draft) => {
          draft.data.count.read = count
        })
      }
      break
    }
  }
}

export const articleReadCountHandlers = {
  [EventTypes.ARTICLE_READ_COUNT_UPDATE]: articleReadCountUpdateHandler,
} as const
