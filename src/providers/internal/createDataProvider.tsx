'use client'

import { createContext, memo, useCallback, useContext, useEffect } from 'react'
import { produce } from 'immer'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { PrimitiveAtom } from 'jotai'
import type { FC, PropsWithChildren } from 'react'

import { useBeforeMounted } from '~/hooks/common/use-before-mounted'
import { noopArr } from '~/lib/noop'
import { jotaiStore } from '~/lib/store'

export const createDataProvider = <Model,>() => {
  const CurrentDataAtomContext = createContext(
    null! as PrimitiveAtom<null | Model>,
  )
  const globalCurrentDataAtom = atom<null | Model>(null)
  const CurrentDataAtomProvider: FC<
    PropsWithChildren<{
      overrideAtom?: PrimitiveAtom<null | Model>
    }>
  > = ({ children, overrideAtom }) => {
    return (
      <CurrentDataAtomContext.Provider
        value={overrideAtom ?? globalCurrentDataAtom}
      >
        {children}
      </CurrentDataAtomContext.Provider>
    )
  }
  const CurrentDataProvider: FC<
    {
      data: Model
    } & PropsWithChildren
  > = memo(({ data, children }) => {
    const currentDataAtom =
      useContext(CurrentDataAtomContext) ?? globalCurrentDataAtom

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

  CurrentDataProvider.displayName = 'CurrentDataProvider'

  const useCurrentDataSelector = <T,>(
    selector: (data: Model | null) => T,
    deps?: any[],
  ) => {
    const currentDataAtom =
      useContext(CurrentDataAtomContext) ?? globalCurrentDataAtom
    const nextSelector = useCallback((data: Model | null) => {
      return data ? selector(data) : null
    }, deps || noopArr)

    return useAtomValue(selectAtom(currentDataAtom, nextSelector))
  }

  const useSetCurrentData = () =>
    useSetAtom(useContext(CurrentDataAtomContext) ?? globalCurrentDataAtom)

  const setGlobalCurrentData = (recipe: (draft: Model) => void) => {
    jotaiStore.set(
      globalCurrentDataAtom,
      produce(jotaiStore.get(globalCurrentDataAtom), recipe),
    )
  }

  const getGlobalCurrentData = () => {
    return jotaiStore.get(globalCurrentDataAtom)
  }

  return {
    CurrentDataAtomProvider,
    CurrentDataProvider,
    useCurrentDataSelector,
    useSetCurrentData,
    setGlobalCurrentData,
    getGlobalCurrentData,
  }
}
