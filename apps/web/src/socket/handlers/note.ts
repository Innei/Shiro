import type { NoteModel } from '@mx-space/api-client'
import * as React from 'react'

import {
  getTranslation,
  getViewingOriginal,
  setTranslationPending,
} from '~/atoms/translation'
import { FaSolidFeatherAlt } from '~/components/icons/menu-collection'
import { DOMCustomEvents } from '~/constants/event'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { toast } from '~/lib/toast'
import {
  getCurrentNoteData,
  setCurrentNoteData,
} from '~/providers/note/CurrentNoteDataProvider'
import { EventTypes } from '~/types/events'

import type { EventHandler } from './types'
import { trackerRealtimeEvent, updateMessage } from './types'

export const noteCreateHandler: EventHandler = (data) => {
  const { title, nid } = data as NoteModel

  toast.success(`有新的内容发布了：「${title}」`, {
    onClick: () => {
      window.peek(`/notes/${nid}`)
    },
    iconElement: React.createElement(FaSolidFeatherAlt),
    autoClose: false,
  })

  trackerRealtimeEvent()
}

export const noteUpdateHandler: EventHandler = (data) => {
  const note = data as NoteModel
  const currentData = getCurrentNoteData()?.data

  if (!currentData) return
  if (currentData.id !== note.id) return

  const contentChanged =
    currentData.text !== note.text || currentData.content !== note.content

  const currentTranslation = getTranslation()
  if (
    currentTranslation &&
    currentTranslation.refId === note.id &&
    !getViewingOriginal() &&
    contentChanged
  ) {
    setTranslationPending(true)
  }

  setCurrentNoteData((draft) => {
    Object.assign(draft.data, note)
  })
  toast.info(updateMessage)
  trackerRealtimeEvent()

  if (contentChanged) {
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent(DOMCustomEvents.RefreshToc))
    }, 100)
  }
}

export const noteDeleteHandler: EventHandler = (data, { router }) => {
  const note = data as NoteModel
  if (
    location.pathname ===
      routeBuilder(Routes.Note, {
        id: note.id,
      }) &&
    getCurrentNoteData()?.data.id === note.id
  ) {
    router.replace(routeBuilder(Routes.PageDeletd, {}))
    toast.error('手记已删除')
    trackerRealtimeEvent()
  }
}

export const noteHandlers = {
  [EventTypes.NOTE_CREATE]: noteCreateHandler,
  [EventTypes.NOTE_UPDATE]: noteUpdateHandler,
  [EventTypes.NOTE_DELETE]: noteDeleteHandler,
} as const
