import { atom } from 'jotai'

export const isInReadingAtom = atom(false)
export const isFocusReadingAtom = atom(false)
export const isMouseInMarkdownAtom = atom(false)
export const immersiveReadingEnabledAtom = atom(false)
export const mainMarkdownElementAtom = atom<HTMLElement | null>(null)
