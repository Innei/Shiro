import type { Image } from '@mx-space/api-client'
import { atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { createContext, use, useCallback, useEffect } from 'react'

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
    <MarkdownImageRecordProviderInternal value={atomRef}>
      {children}
    </MarkdownImageRecordProviderInternal>
  )
}

export const useMarkdownImageRecord = (src: string) =>
  useAtomValue(
    selectAtom(
      use(MarkdownImageRecordProviderInternal),
      useCallback(
        (value: Image[]) => value.find((image) => image.src === src),
        [src],
      ),
    ),
  )
