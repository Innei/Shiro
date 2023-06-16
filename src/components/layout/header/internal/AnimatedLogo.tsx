'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { useViewport } from '~/atoms'

import { useHeaderMetaShouldShow } from './hooks'
import { Logo } from './Logo'

export const AnimatedLogo = () => {
  const shouldShowMeta = useHeaderMetaShouldShow()

  const isDesktop = useViewport(($) => $.lg && $.w !== 0)

  if (isDesktop) return <Logo />

  return (
    <AnimatePresence>
      {!shouldShowMeta && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Logo />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
