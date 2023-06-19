import { useCallback, useEffect } from 'react'
import { atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { AggregateRoot } from '@mx-space/api-client'
import type { FC, PropsWithChildren } from 'react'

import { login } from '~/atoms/owner'
import { useAggregationQuery } from '~/hooks/data/use-aggregation'
import { jotaiStore } from '~/lib/store'

export const aggregationDataAtom = atom<null | AggregateRoot>(null)

export const AggregationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data } = useAggregationQuery()

  useEffect(() => {
    if (!data) return
    jotaiStore.set(aggregationDataAtom, data)
  }, [data])

  useEffect(() => {
    login()
  }, [])

  return children
}

/**
 * Not recommended to use
 */
export const useAggregationData = () => useAtomValue(aggregationDataAtom)

export const useAggregationSelector = <T,>(
  selector: (atomValue: AggregateRoot) => T,
  deps: any[] = [],
): T | null =>
  useAtomValue(
    // @ts-ignore
    selectAtom(
      aggregationDataAtom,
      useCallback(
        (atomValue) => (!atomValue ? null : selector(atomValue)),
        deps,
      ),
    ),
  )
