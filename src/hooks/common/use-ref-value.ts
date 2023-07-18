import { useRef } from 'react'

// @see https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
export const useRefValue = <T>(value: () => T): T => {
  const ref = useRef<T>()

  const onceRef = useRef(false)

  if (!onceRef.current) {
    ref.current = value()
    onceRef.current = true
  }

  return ref.current!
}
