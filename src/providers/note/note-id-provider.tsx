'use client'

import { createContextState } from 'foxact/context-state'

export const [NoteIdProvider, useNoteId, useSetNoteId] = createContextState<
  undefined | string
>(undefined)
