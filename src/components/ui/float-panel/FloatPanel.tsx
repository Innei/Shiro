import type { Placement, Strategy } from '@floating-ui/react-dom'
import { flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import { AnimatePresence, m } from 'motion/react'
import type { FC, PropsWithChildren } from 'react'
import { cloneElement, useMemo, useRef, useState } from 'react'

import { clsxm } from '~/lib/helper'

import { RootPortal } from '../portal'

interface FloatPanelProps {
  triggerElement: Parameters<typeof cloneElement>[0]
  strategy?: Strategy
  placement?: Placement
}

export const FloatPanel: FC<FloatPanelProps & PropsWithChildren> = (props) => {
  const {
    triggerElement,
    strategy = 'fixed',
    placement = 'right',
    children,
  } = props

  const [panelOpen, setPanelOpen] = useState(false)

  const { isPositioned, refs, x, y, elements } = useFloating({
    strategy,
    placement,
    middleware: [flip({ padding: 20 }), offset(10), shift()],
  })

  const floatingRef = useRef<HTMLElement>()
  floatingRef.current = elements.floating || undefined
  // @ts-ignore
  // useClickAway(floatingRef, (e) => {

  //   setPanelOpen(false)
  // })

  return (
    <>
      {useMemo(
        () =>
          cloneElement(triggerElement, {
            // @ts-ignore
            ref: refs.setReference,
            onClick: () => {
              setPanelOpen((v) => !v)
            },
          }),
        [refs.setReference, triggerElement],
      )}

      <RootPortal>
        <AnimatePresence>
          {panelOpen && (
            <m.div
              initial={{ opacity: 0.02, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.02, y: 10 }}
              className={clsxm(
                '!shadow-out-sm focus:!shadow-out-sm focus-visible:!shadow-out-sm',
                'rounded-xl border border-zinc-400/20 p-4 shadow-lg outline-none backdrop-blur-lg dark:border-zinc-500/30',
                'bg-zinc-50/80 dark:bg-neutral-900/80',

                'relative z-[2]',
              )}
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? '',
                left: x ?? '',
                visibility: isPositioned && x !== null ? 'visible' : 'hidden',
              }}
            >
              {children}
            </m.div>
          )}
        </AnimatePresence>
      </RootPortal>
    </>
  )
}
