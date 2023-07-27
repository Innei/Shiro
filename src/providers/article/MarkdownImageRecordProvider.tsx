import { createContext, useCallback, useContext, useEffect } from 'react'
import { atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { Image } from '@mx-space/api-client'

import { useRefValue } from '~/hooks/common/use-ref-value'
import { jotaiStore } from '~/lib/store'

const MarkdownImageRecordProviderInternal = createContext(atom([] as Image[]))

export const MarkdownImageRecordProvider: Component<{
  images: Image[]
}> = ({ children, images }) => {
  const atomRef = useRefValue(() => atom(images as Image[]))

  useEffect(() => {
    jotaiStore.set(atomRef, images)
  }, [images])

  return (
    <MarkdownImageRecordProviderInternal.Provider value={atomRef}>
      {children}
    </MarkdownImageRecordProviderInternal.Provider>
  )
}

export const useMarkdownImageRecord = (src: string) => {
  return useAtomValue(
    selectAtom(
      useContext(MarkdownImageRecordProviderInternal),
      useCallback(
        (value: Image[]) => {
          return value.find((image) => image.src === src)
        },
        [src],
      ),
    ),
  )
}
