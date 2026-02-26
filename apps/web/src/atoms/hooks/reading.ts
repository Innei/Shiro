import { createAtomHooks } from 'jojoo/react'
import { useEffect } from 'react'

import {
  immersiveReadingEnabledAtom,
  isFocusReadingAtom,
  isInReadingAtom,
  isMouseInMarkdownAtom,
  mainMarkdownElementAtom,
} from '../reading'

export const [, , useIsInReading, , getIsInReading, setIsInReading] =
  createAtomHooks(isInReadingAtom)

export const [, , useIsFocusReading, , getIsFocusReading, setIsFocusReading] =
  createAtomHooks(isFocusReadingAtom)

export const [
  ,
  ,
  useIsMouseInMarkdown,
  ,
  getIsMouseInMarkdown,
  setIsMouseInMarkdown,
] = createAtomHooks(isMouseInMarkdownAtom)

export const [
  ,
  ,
  useIsImmersiveReadingEnabled,
  ,
  getIsImmersiveReadingEnabled,
  setIsImmersiveReadingEnabled,
] = createAtomHooks(immersiveReadingEnabledAtom)

export const [
  ,
  ,
  useMainMarkdownElement,
  ,
  getMainMarkdownElement,
  setMainMarkdownElement,
] = createAtomHooks(mainMarkdownElementAtom)

export const useReadingPage = () => {
  useEffect(() => {
    setIsInReading(true)
  }, [])
}

export const useFocusReading = () => {
  useEffect(() => {
    setIsInReading(true)
    setIsFocusReading(true)
  }, [])
}
