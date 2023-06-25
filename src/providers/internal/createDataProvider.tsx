'use client'

import { memo, useCallback, useEffect } from 'react'
import { produce } from 'immer'
import { atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { FC, PropsWithChildren } from 'react'

import { useBeforeMounted } from '~/hooks/common/use-before-mounted'
import { noopArr } from '~/lib/noop'
import { jotaiStore } from '~/lib/store'

export const createDataProvider = <Model,>() => {
  const currentDataAtom = atom<null | Model>(null)
  const CurrentDataProvider: FC<
    {
      data: Model
    } & PropsWithChildren
  > = memo(({ data, children }) => {
    useBeforeMounted(() => {
      jotaiStore.set(currentDataAtom, data)
    })

    useEffect(() => {
      jotaiStore.set(currentDataAtom, data)
    }, [data])

    useEffect(() => {
      return () => {
        jotaiStore.set(currentDataAtom, null)
      }
    }, [])

    return children
  })
  const useCurrentDataSelector = <T,>(
    selector: (data: Model | null) => T,
    deps?: any[],
  ) => {
    const nextSelector = useCallback((data: Model | null) => {
      return data ? selector(data) : null
    }, deps || noopArr)

    return useAtomValue(selectAtom(currentDataAtom, nextSelector))
  }

  const setCurrentData = (recipe: (draft: Model) => void) => {
    jotaiStore.set(
      currentDataAtom,
      produce(jotaiStore.get(currentDataAtom), recipe),
    )
  }

  const getCurrentData = () => {
    return jotaiStore.get(currentDataAtom)
  }

  return {
    CurrentDataProvider,
    useCurrentDataSelector,
    setCurrentData,
    getCurrentData,
  }
}
