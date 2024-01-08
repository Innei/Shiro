import { useCallback, useLayoutEffect, useRef } from 'react'

export const useUncontrolledInput = <
  T extends { value: string } = HTMLInputElement,
>(
  initialValue?: string,
) => {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    if (initialValue) {
      ref.current && (ref.current.value = initialValue)
    }
  }, [])

  return [
    ref.current?.value,
    useCallback(() => ref.current?.value, []),
    ref,
  ] as const
}
