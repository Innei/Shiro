'use client'

import { flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { UseFloatingOptions } from '@floating-ui/react-dom'
import type { FC, PropsWithChildren } from 'react'

import useClickAway from '~/hooks/common/use-click-away'
import { clsxm } from '~/lib/helper'

import { RootPortal } from '../portal'
import styles from './index.module.css'

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

  const [mounted, setMounted] = useState(false)

  const [currentStatus, setCurrentStatus] = useState(false)
  const [open, setOpen] = useState(false)
  const { x, y, refs, strategy, update, isPositioned } = useFloating({
    middleware: floatingProps.middleware ?? [
      flip({ padding: padding ?? 20 }),
      offset(offsetValue ?? 10),
      shift(),
    ],
    strategy: floatingProps.strategy,
    placement: floatingProps.placement ?? 'bottom-start',
    whileElementsMounted: floatingProps.whileElementsMounted,
  })
  const updateOnce = useRef(false)
  const doPopoverShow = useCallback(() => {
    setCurrentStatus(true)
    setMounted(true)

    if (!updateOnce.current) {
      requestAnimationFrame(() => {
        update()
        updateOnce.current = true
      })
    }
  }, [])

  const [containerAnchorRef, setContainerAnchorRef] =
    useState<HTMLDivElement | null>()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTransition = useCallback(
    (status: 'in' | 'out') => {
      const nextElementSibling =
        containerAnchorRef?.nextElementSibling as HTMLDivElement

      if (!nextElementSibling) {
        return
      }

      if (status === 'in') {
        nextElementSibling.ontransitionend = null
        nextElementSibling.classList.add(styles.show)
      } else {
        nextElementSibling.classList.remove(styles.show)
        nextElementSibling.ontransitionend = () => {
          setOpen(false)
          setMounted(false)
        }
      }
    },
    [containerAnchorRef?.nextElementSibling],
  )

  useEffect(() => {
    if (!containerAnchorRef) {
      return
    }

    if (currentStatus) {
      setOpen(true)
      requestAnimationFrame(() => {
        handleTransition('in')
      })
    } else {
      requestAnimationFrame(() => {
        handleTransition('out')
      })
    }
  }, [currentStatus, containerAnchorRef, handleTransition])

  useClickAway(containerRef, () => {
    if (trigger == 'click' || trigger == 'both') {
      doPopoverDisappear()
      clickTriggerFlag.current = false
    }
  })

  const doPopoverDisappear = useCallback(() => {
    if (debug) {
      return
    }
    if (!animate) {
      setOpen(false)
    }
    setCurrentStatus(false)
  }, [debug, animate])

  const clickTriggerFlag = useRef(false)
  const handleMouseOut = useCallback(() => {
    if (clickTriggerFlag.current === true) {
      return
    }
    doPopoverDisappear()
  }, [])
  const handleClickTrigger = useCallback(() => {
    clickTriggerFlag.current = true
    doPopoverShow()
  }, [])

  const listener = useMemo(() => {
    const baseListener = {
      onFocus: doPopoverShow,
      onBlur: doPopoverDisappear,
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
          onClick: handleClickTrigger,
          onMouseOver: doPopoverShow,
          onMouseOut: handleMouseOut,
        }
    }
  }, [
    doPopoverDisappear,
    doPopoverShow,
    handleClickTrigger,
    handleMouseOut,
    trigger,
  ])

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

      {mounted && (
        <RootPortal>
          <div
            className={clsxm(
              'float-popover',
              'relative z-[99]',
              popoverWrapperClassNames,
            )}
            {...(trigger === 'hover' || trigger === 'both' ? listener : {})}
            ref={containerRef}
          >
            <div ref={setContainerAnchorRef} />
            {open && (
              <div
                tabIndex={-1}
                role={type === 'tooltip' ? 'tooltip' : 'dialog'}
                className={clsxm(
                  !headless && [
                    '!shadow-out-sm focus:!shadow-out-sm focus-visible:!shadow-out-sm',
                    'rounded-xl border border-zinc-400/20 p-4 shadow-lg outline-none backdrop-blur-lg dark:border-zinc-500/30',
                    'bg-slate-50/80 dark:bg-neutral-900/80',
                  ],

                  'relative z-[2]',

                  headless && styles['headless'],
                  animate && styles['animate'],
                  type === 'tooltip'
                    ? `max-w-[25rem] break-all rounded-xl px-4 py-2 ${styles['headless']}`
                    : styles['popover-root'],
                  popoverClassNames,
                )}
                ref={refs.setFloating}
                style={{
                  position: strategy,
                  top: y ?? '',
                  left: x ?? '',
                  visibility: isPositioned && x !== null ? 'visible' : 'hidden',
                }}
              >
                {props.children}
              </div>
            )}
          </div>
        </RootPortal>
      )}
    </>
  )
}
