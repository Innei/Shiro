import { useEffect, useState } from 'react'

import { useGetState } from './use-get-state'

export const usePreventComposition = (el: HTMLElement) => {
  const [isComposing, setIsComposing] = useState(false)
  const getIsComposing = useGetState(isComposing)
  useEffect(() => {
    if (!el) return
    const compositionHandler = (e: CompositionEvent) => {
      setIsComposing(e.type === 'compositionstart')
    }

    const keyDownHandler = (e: KeyboardEvent) => {
      const isComposing = getIsComposing()

      if (isComposing && e.key === 'Escape') e.stopPropagation()
    }

    el.addEventListener('keydown', keyDownHandler)
    el.addEventListener('compositionstart', compositionHandler)
    el.addEventListener('compositionend', compositionHandler)
    return () => {
      el.removeEventListener('compositionstart', compositionHandler)
      el.removeEventListener('compositionend', compositionHandler)
      el.removeEventListener('keydown', keyDownHandler)
    }
  }, [getIsComposing, el])
}
