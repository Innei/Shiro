'use client'

import { useContext, useRef } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context'
import { usePathname } from 'next/navigation'
import type { PropsWithChildren } from 'react'

import { microDampingPreset } from '~/constants/spring'

export function useLayoutRouterContext() {
  return useContext(LayoutRouterContext)
}

function FrozenRouter(props: PropsWithChildren<{}>) {
  const context = useLayoutRouterContext()
  const frozen = useRef(context).current

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  )
}

export const PageTransition: Component = ({ children }) => {
  const pathname = usePathname()
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <m.div
        key={pathname}
        initial={{
          opacity: 0.001,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0.001,
          y: -20,
        }}
        transition={microDampingPreset}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </m.div>
    </AnimatePresence>
  )
}
