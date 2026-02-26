import { useEffect, useRef } from 'react'

export const useIsUnMounted = () => {
  const unmounted = useRef(false)
  useEffect(() => {
    unmounted.current = false
    return () => {
      unmounted.current = true
    }
  }, [])

  return unmounted
}
