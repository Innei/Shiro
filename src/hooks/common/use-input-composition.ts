import { useCallback, useRef } from 'react'
import type { CompositionEventHandler } from 'react'

export const useInputComposition = (
  props:
    | React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >
    | React.DetailedHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >,
) => {
  const { onKeyDown, onCompositionStart, onCompositionEnd } = props

  const isCompositionRef = useRef(false)

  const handleCompositionStart: CompositionEventHandler<any> = useCallback(
    (e) => {
      isCompositionRef.current = true
      onCompositionStart?.(e)
    },
    [onCompositionStart],
  )

  const handleCompositionEnd: CompositionEventHandler<any> = useCallback(
    (e) => {
      isCompositionRef.current = false
      onCompositionEnd?.(e)
    },
    [onCompositionEnd],
  )

  const handleKeyDown: React.KeyboardEventHandler<any> = useCallback(
    (e) => {
      onKeyDown?.(e)

      if (isCompositionRef.current) {
        e.stopPropagation()
        return
      }
    },
    [onKeyDown],
  )

  return {
    onCompositionEnd: handleCompositionEnd,
    onCompositionStart: handleCompositionStart,
    onKeyDown: handleKeyDown,
  }
}
