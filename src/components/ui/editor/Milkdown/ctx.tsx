import type { Ctx } from '@milkdown/ctx'
import { atom, useAtomValue } from 'jotai'

import { jotaiStore } from '~/lib/store'

export const editorCtxAtom = atom<Ctx | null>(null)

export const useEditorCtx = () => useAtomValue(editorCtxAtom)

export const setEditorCtx = (ctx: Ctx) => jotaiStore.set(editorCtxAtom, ctx)
