import { useEffect } from 'react'

import { EmitKeyMap } from '~/constants/keys'
import { useForceUpdate } from '~/hooks/common/use-force-update'

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
