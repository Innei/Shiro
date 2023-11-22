'use client'

import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { Bilibili } from '~/app/config'

import { isLogged, useResolveAdminUrl, useViewport } from '~/atoms'
import { useSingleAndDoubleClick } from '~/hooks/common/use-single-double-click'
import { noopObj } from '~/lib/noop'
import { Routes } from '~/lib/route-builder'
import { useAppConfigSelector } from '~/providers/root/aggregation-data-provider'

import { Activity } from './Activity'
import { useHeaderMetaShouldShow } from './hooks'
import { SiteOwnerAvatar } from './SiteOwnerAvatar'

const TapableLogo = () => {
  const router = useRouter()

  const { data: isLiving } = useQuery({
    queryKey: ['live-check'],
    enabled: false,
  })

  const { liveId } = (useAppConfigSelector(
    (config) => config.module?.bilibili,
  ) || noopObj) as Bilibili

  const goLive = useCallback(() => {
    window.open(`https://live.bilibili.com/${liveId}`)
  }, [liveId])

  const resolveAdminUrl = useResolveAdminUrl()

  const fn = useSingleAndDoubleClick(
    () => {
      if (isLiving) return goLive()
      router.push(Routes.Home)
    },
    () => {
      if (isLogged()) {
        location.href = resolveAdminUrl()

        return
      }
      router.push(
        `${Routes.Login}?redirect=${encodeURIComponent(location.pathname)}`,
      )
    },
  )
  // return <Logo onClick={fn} className="cursor-pointer" />
  return (
    <button onClick={fn}>
      <SiteOwnerAvatar className="cursor-pointer" />
      <span className="sr-only">Owner Avatar</span>
    </button>
  )
}
export const AnimatedLogo = () => {
  const shouldShowMeta = useHeaderMetaShouldShow()

  const isDesktop = useViewport(($) => $.lg && $.w !== 0)

  if (isDesktop)
    return (
      <>
        <TapableLogo />
        <Activity />
      </>
    )

  return (
    <AnimatePresence>
      {!shouldShowMeta && (
        <m.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // className="scale-75"
        >
          <Activity />
          <TapableLogo />
        </m.div>
      )}
    </AnimatePresence>
  )
}
