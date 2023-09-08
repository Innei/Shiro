'use client'

import { flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import type { UseFloatingOptions } from '@floating-ui/react-dom'
import type { FC, PropsWithChildren } from 'react'

import { microReboundPreset } from '~/constants/spring'
import useClickAway from '~/hooks/common/use-click-away'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { clsxm } from '~/lib/helper'

import { RootPortal } from '../portal'

type FloatPopoverProps<T> = PropsWithChildren<{
  TriggerComponent: FC<T>
  headless?: boolean
  wrapperClassName?: string
  trigger?: 'click' | 'hover' | 'both'
  padding?: number
  offset?: number
  popoverWrapperClassNames?: string
  popoverClassNames?: string

  triggerComponentProps?: T
  /**
   * 不消失
   */
  debug?: boolean

  animate?: boolean

  as?: keyof HTMLElementTagNameMap

  /**
   * @default popover
   */
  type?: 'tooltip' | 'popover'
}> &
  UseFloatingOptions

export const FloatPopover = function FloatPopover<T extends {}>(
  props: FloatPopoverProps<T>,
) {
  const {
    headless = false,
    wrapperClassName: wrapperClassNames,
    TriggerComponent,
    trigger = 'hover',
    padding,
    offset: offsetValue,
    popoverWrapperClassNames,
    popoverClassNames,
    debug,
    animate = true,
    as: As = 'div',
    type = 'popover',
    triggerComponentProps,
    ...floatingProps
  } = props

  const [open, setOpen] = useState(false)
  const { x, y, refs, strategy, isPositioned } = useFloating({
    middleware: floatingProps.middleware ?? [
      flip({ padding: padding ?? 20 }),
      offset(offsetValue ?? 10),
      shift(),
    ],
    strategy: floatingProps.strategy,
    placement: floatingProps.placement ?? 'bottom-start',
    whileElementsMounted: floatingProps.whileElementsMounted,
  })

  const containerRef = useRef<HTMLDivElement>(null)

  useClickAway(containerRef, () => {
    if (trigger == 'click' || trigger == 'both') {
      doPopoverDisappear()
    }
  })

  const doPopoverDisappear = useCallback(() => {
    if (debug) {
      return
    }
    setOpen(false)
  }, [debug, animate])

  const doPopoverShow = useEventCallback(() => {
    setOpen(true)
  })

  const handleMouseOut = useCallback(() => {
    doPopoverDisappear()
  }, [])

  const listener = useMemo(() => {
    const baseListener = {
      // onFocus: doPopoverShow,
      // onBlur: doPopoverDisappear,
    }
    switch (trigger) {
      case 'click':
        return {
          ...baseListener,
          onClick: doPopoverShow,
        }
      case 'hover':
        return {
          ...baseListener,
          onMouseOver: doPopoverShow,
          onMouseOut: doPopoverDisappear,
        }
      case 'both':
        return {
          ...baseListener,
          onClick: doPopoverShow,
          onMouseOver: doPopoverShow,
          onMouseOut: handleMouseOut,
        }
    }
  }, [doPopoverDisappear, doPopoverShow, handleMouseOut, trigger])

  const TriggerWrapper = (
    <As
      // @ts-ignore
      role={trigger === 'both' || trigger === 'click' ? 'button' : 'note'}
      className={clsxm('inline-block', wrapperClassNames)}
      ref={refs.setReference}
      {...listener}
    >
      {/* @ts-expect-error */}
      {React.cloneElement(<TriggerComponent {...triggerComponentProps} />, {
        tabIndex: 0,
      })}
    </As>
  )

  useEffect(() => {
    if (refs.floating.current && open && type === 'popover') {
      refs.floating.current.focus()
    }
  }, [open])

  if (!props.children) {
    return TriggerWrapper
  }

  return (
    <>
      {TriggerWrapper}

      <AnimatePresence>
        {open && (
          <RootPortal>
            <m.div
              className={clsxm(
                'float-popover',
                'relative z-[99]',
                popoverWrapperClassNames,
              )}
              {...(trigger === 'hover' || trigger === 'both' ? listener : {})}
              ref={containerRef}
            >
              <m.div
                tabIndex={-1}
                role={type === 'tooltip' ? 'tooltip' : 'dialog'}
                className={clsxm(
                  !headless && [
                    '!shadow-out-sm focus:!shadow-out-sm focus-visible:!shadow-out-sm',
                    'rounded-xl border border-zinc-400/20 p-4 shadow-lg outline-none backdrop-blur-lg dark:border-zinc-500/30',
                    'bg-slate-50/80 dark:bg-neutral-900/80',
                  ],

                  'relative z-[2]',

                  type === 'tooltip'
                    ? `max-w-[25rem] break-all rounded-xl px-4 py-2`
                    : '',
                  popoverClassNames,
                )}
                ref={refs.setFloating}
                initial={{ translateY: '10px', opacity: 0 }}
                animate={{ translateY: '0px', opacity: 1 }}
                exit={{ translateY: '10px', opacity: 0 }}
                transition={microReboundPreset}
                style={{
                  position: strategy,
                  top: y ?? '',
                  left: x ?? '',
                  visibility: isPositioned && x !== null ? 'visible' : 'hidden',
                }}
              >
                {props.children}
              </m.div>
            </m.div>
          </RootPortal>
        )}
      </AnimatePresence>
    </>
  )
}
