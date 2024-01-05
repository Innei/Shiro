'use client'

import { useCallback, useEffect, useRef } from 'react'
import { atom, useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { AggregateRoot } from '@mx-space/api-client'
import type { FC, PropsWithChildren } from 'react'

import { fetchAppUrl, setWebUrl } from '~/atoms'
import { login } from '~/atoms/owner'
import { useBeforeMounted } from '~/hooks/common/use-before-mounted'
import { jotaiStore } from '~/lib/store'

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

    login().then((logged) => {
      if (logged) {
        // FIXME
        setTimeout(() => {
          fetchAppUrl()
        }, 1000)
      }
    })
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
        (atomValue) => (!atomValue ? null : selector(atomValue)),
        deps,
      ),
    ),
  )

export const getAggregationData = () => jotaiStore.get(aggregationDataAtom)

export const getAppConfig = () => jotaiStore.get(appConfigAtom)
