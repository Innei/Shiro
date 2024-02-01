import { useEffect } from 'react'
import { useForceUpdate } from 'framer-motion'

import { EmitKeyMap } from '~/constants/keys'

export const useRefetchData = (refetchFn: () => Promise<any>) => {
  const [forceUpdate, key] = useForceUpdate()
  useEffect(() => {
    const handler = () => {
      refetchFn().then(forceUpdate)
    }
    window.addEventListener(EmitKeyMap.Refetch, handler)
    return () => {
      window.removeEventListener(EmitKeyMap.Refetch, handler)
    }
  }, [forceUpdate, refetchFn])

  return [key] as const
}
