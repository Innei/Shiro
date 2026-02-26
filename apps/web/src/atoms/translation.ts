import { atom, useAtomValue, useSetAtom } from 'jotai'

import { jotaiStore } from '~/lib/store'
import type { AITranslation } from '~/types/translation'

// 翻译数据 atom
const translationAtom = atom<AITranslation | null>(null)

// 翻译是否正在生成中
const translationPendingAtom = atom(false)

// 是否查看原文（用户主动切换）
const viewingOriginalAtom = atom(false)

// Hooks
export function useTranslation() {
  return useAtomValue(translationAtom)
}

export function useSetTranslation() {
  return useSetAtom(translationAtom)
}

export function useTranslationPending() {
  return useAtomValue(translationPendingAtom)
}

export function useSetTranslationPending() {
  return useSetAtom(translationPendingAtom)
}

export function useViewingOriginal() {
  return useAtomValue(viewingOriginalAtom)
}

export function useSetViewingOriginal() {
  return useSetAtom(viewingOriginalAtom)
}

export function setTranslation(translation: AITranslation | null) {
  jotaiStore.set(translationAtom, translation)
}

export function getTranslation() {
  return jotaiStore.get(translationAtom)
}

export function setTranslationPending(pending: boolean) {
  jotaiStore.set(translationPendingAtom, pending)
}

export function getTranslationPending() {
  return jotaiStore.get(translationPendingAtom)
}

export function setViewingOriginal(viewing: boolean) {
  jotaiStore.set(viewingOriginalAtom, viewing)
}

export function getViewingOriginal() {
  return jotaiStore.get(viewingOriginalAtom)
}
