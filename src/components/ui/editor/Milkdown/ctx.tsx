import { atom, useAtomValue } from 'jotai'
import type { Ctx } from '@milkdown/ctx'

import { jotaiStore } from '~/lib/store'

export const editorCtxAtom = atom<Ctx | null>(null)

export const useEditorCtx = () => useAtomValue(editorCtxAtom)

export const setEditorCtx = (ctx: Ctx) => jotaiStore.set(editorCtxAtom, ctx)
