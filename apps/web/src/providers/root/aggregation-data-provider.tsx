'use client'

import type { AggregateRoot } from '@mx-space/api-client'
import { atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { FC, PropsWithChildren } from 'react'
import { useCallback, useEffect, useRef } from 'react'

import { setWebUrl } from '~/atoms'
import { useBeforeMounted } from '~/hooks/common/use-before-mounted'
import { isDev } from '~/lib/env'
import { jotaiStore } from '~/lib/store'

export type { AggregateRoot }

export const aggregationDataAtom = atom<null | AggregateRoot>(null)
const appConfigAtom = atom<AppConfig | null>(null)

export const AggregationProvider: FC<
  PropsWithChildren<{
    aggregationData: AggregateRoot
    appConfig: AppConfig
  }>
> = ({ children, aggregationData, appConfig }) => {
  useBeforeMounted(() => {
    if (!aggregationData) return
    jotaiStore.set(aggregationDataAtom, aggregationData)
    setWebUrl(aggregationData.url.webUrl)
  })
  useBeforeMounted(() => {
    if (!appConfig) return
    jotaiStore.set(appConfigAtom, appConfig)
  })
  // useHydrateAtoms(
  //   [
  //     [aggregationDataAtom, aggregationData],
  //     [appConfigAtom, appConfig],
  //   ],
  //   {
  //     dangerouslyForceHydrate: true,
  //   },
  // )

  useEffect(() => {
    if (!appConfig) return
    jotaiStore.set(appConfigAtom, appConfig)
  }, [appConfig])

  useEffect(() => {
    if (!aggregationData) return
    jotaiStore.set(aggregationDataAtom, aggregationData)
    setWebUrl(aggregationData.url.webUrl)
  }, [aggregationData])

  const callOnceRef = useRef(false)

  useEffect(() => {
    if (callOnceRef.current) return
    if (!aggregationData?.user) return
    callOnceRef.current = true
  }, [aggregationData?.user])

  return children
}

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

export const useAppConfigSelector = <T,>(
  selector: (atomValue: AppConfig) => T,
  deps: any[] = [],
): T | null =>
  useAtomValue(
    // @ts-ignore
    selectAtom(
      appConfigAtom,
      useCallback(
        (atomValue) =>
          !atomValue ? null : noThrowFnWrapper(selector)(atomValue),
        deps,
      ),
    ),
  )

export const getAggregationData = () => jotaiStore.get(aggregationDataAtom)

export const getAppConfig = () => jotaiStore.get(appConfigAtom)

const noThrowFnWrapper = <T extends (...args: any[]) => any>(fn: T): T => {
  return ((...args: any[]) => {
    try {
      return fn(...args)
    } catch (e: any) {
      if (isDev) {
        console.error(e)
      }
      return null
    }
  }) as T
}
