'use client'

import { createContextState } from 'foxact/context-state'

export const [CurrentNoteIdProvider, useCurrentNoteId, useSetCurrentNoteId] =
  createContextState<undefined | string>(undefined)
