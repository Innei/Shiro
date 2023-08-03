import { atom } from 'jotai'
import type { NoteModel, PostModel } from '@mx-space/api-client'

export const previewDataAtom = atom<PostModel | NoteModel | null>(null)
