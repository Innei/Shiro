'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

import { getAdminUrl, isLogged, useViewport } from '~/atoms'
import { useSingleAndDoubleClick } from '~/hooks/common/use-single-double-click'
import { Routes } from '~/lib/route-builder'
import { toast } from '~/lib/toast'

import { useHeaderMetaShouldShow } from './hooks'
import { Logo } from './Logo'

const TapableLogo = () => {
  const router = useRouter()
  const fn = useSingleAndDoubleClick(
    () => {
      router.push(Routes.Home)
    },
    () => {
      if (isLogged()) {
        const adminUrl = getAdminUrl()
        if (adminUrl) location.href = adminUrl
        else {
          toast('Admin url not found', 'error')
        }
        return
      }
      router.push(Routes.Login)
    },
  )
  return <Logo onClick={fn} className="cursor-pointer" />
}
export const AnimatedLogo = () => {
  const shouldShowMeta = useHeaderMetaShouldShow()

  const isDesktop = useViewport(($) => $.lg && $.w !== 0)

  if (isDesktop) return <TapableLogo />

  return (
    <AnimatePresence>
      {!shouldShowMeta && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="scale-75"
        >
          <TapableLogo />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
