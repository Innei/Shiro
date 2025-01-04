'use client'

import type { UseFloatingOptions } from '@floating-ui/react-dom'
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom'
import { AnimatePresence, m } from 'motion/react'
import type { FC, PropsWithChildren, ReactElement } from 'react'
import * as React from 'react'
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { microReboundPreset } from '~/constants/spring'
import useClickAway from '~/hooks/common/use-click-away'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { clsxm } from '~/lib/helper'

import { RootPortal } from '../portal'
import type { PresentSheetProps } from '../sheet'
import { PresentSheet } from '../sheet'

export const FloatPopover = function <T extends {}>(
  props: FloatPopoverProps<T> & {
    mobileAsSheet?: boolean
    sheet?: Partial<Omit<PresentSheetProps, 'content'>>
  },
) {
  const isMobile = useIsMobile()
  if (isMobile && props.mobileAsSheet) {
    const { triggerElement, TriggerComponent, triggerComponentProps } = props

    const Child = triggerElement
      ? triggerElement
      : TriggerComponent
        ? createElement(TriggerComponent as any, triggerComponentProps)
        : null

    return (
      <PresentSheet content={props.children} {...props.sheet}>
        {Child}
      </PresentSheet>
    )
  }
  return <RealFloatPopover {...props} />
}

type FloatPopoverProps<T> = PropsWithChildren<{
  triggerElement?: string | ReactElement
  TriggerComponent?: FC<T>

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
  isDisabled?: boolean

  to?: HTMLElement

  onOpen?: () => void
  onClose?: () => void

  asChild?: boolean
}> &
  UseFloatingOptions

const PopoverActionContext = createContext<{
  close: () => void
}>(null!)

export const usePopoverAction = () => useContext(PopoverActionContext)

const RealFloatPopover = function FloatPopover<T extends {}>(
  props: FloatPopoverProps<T>,
) {
  const {
    headless = false,
    wrapperClassName: wrapperClassNames,
    TriggerComponent,
    triggerElement,
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
    isDisabled,
    onOpen,
    onClose,
    to,
    asChild,
    ...floatingProps
  } = props

  const [open, setOpen] = useState(false)
  const { x, y, refs, strategy, isPositioned, elements, update } = useFloating({
    middleware: floatingProps.middleware ?? [
      flip({ padding: padding ?? 20 }),
      offset(offsetValue ?? 10),
      shift(),
    ],

    strategy: floatingProps.strategy,
    placement: floatingProps.placement ?? 'bottom-start',
    whileElementsMounted: floatingProps.whileElementsMounted,
  })

  useEffect(() => {
    if (open && elements.reference && elements.floating) {
      const cleanup = autoUpdate(elements.reference, elements.floating, update)
      return cleanup
    }
  }, [open, elements, update])

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
  }, [debug])

  const doPopoverShow = useEventCallback(() => {
    if (isDisabled) return
    setOpen(true)
  })

  const handleMouseOut = useCallback(() => {
    doPopoverDisappear()
  }, [doPopoverDisappear])

  const listener = useMemo(() => {
    const baseListener = {
      // onFocus: doPopoverShow,
      // onBlur: doPopoverDisappear,
    }
    switch (trigger) {
      case 'click': {
        return {
          ...baseListener,
          onClick: doPopoverShow,
        }
      }
      case 'hover': {
        return {
          ...baseListener,
          onMouseOver: doPopoverShow,
          onMouseOut: doPopoverDisappear,
        }
      }
      case 'both': {
        return {
          ...baseListener,
          onClick: doPopoverShow,
          onMouseOver: doPopoverShow,
          onMouseOut: handleMouseOut,
        }
      }
    }
  }, [doPopoverDisappear, doPopoverShow, handleMouseOut, trigger])

  const Child = triggerElement ? (
    triggerElement
  ) : TriggerComponent ? (
    React.cloneElement(
      createElement(TriggerComponent as any, triggerComponentProps),

      {
        tabIndex: 0,
      },
    )
  ) : (
    <></>
  )
  const TriggerWrapper = asChild ? (
    React.cloneElement(
      typeof Child === 'string' ? <span>{Child}</span> : Child,
      {
        ...listener,
        ref: refs.setReference,
      },
    )
  ) : (
    <As
      // @ts-ignore
      role={trigger === 'both' || trigger === 'click' ? 'button' : 'note'}
      className={clsxm('inline-block', wrapperClassNames)}
      ref={refs.setReference}
      {...listener}
    >
      {Child}
    </As>
  )

  useEffect(() => {
    if (refs.floating.current && open && type === 'popover') {
      refs.floating.current.focus()
    }
  }, [open])

  useEffect(() => {
    if (open) {
      onOpen?.()
    } else {
      onClose?.()
    }
  }, [open])
  const actionCtxValue = useMemo(() => {
    return { close: doPopoverDisappear }
  }, [doPopoverDisappear])

  if (!props.children) {
    return TriggerWrapper
  }

  return (
    <>
      {TriggerWrapper}

      <AnimatePresence>
        {open && (
          <RootPortal to={to}>
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
                    'rounded-xl border border-zinc-400/20 p-4 outline-none backdrop-blur-lg dark:border-zinc-500/30',
                    'bg-zinc-50/80 dark:bg-neutral-900/80',
                  ],

                  'relative z-[2]',

                  type === 'tooltip'
                    ? `max-w-[25rem] break-all rounded-xl px-4 py-2 shadow-out-sm`
                    : 'shadow-lg',
                  popoverClassNames,
                )}
                ref={refs.setFloating}
                initial={{ translateY: '10px', opacity: 0 }}
                animate={{ translateY: '0px', opacity: 1 }}
                exit={{
                  translateY: '10px',
                  opacity: 0,
                  transition: { type: 'tween', duration: 0.2 },
                }}
                transition={microReboundPreset}
                style={{
                  position: strategy,
                  top: y ?? '',
                  left: x ?? '',
                  visibility: isPositioned && x !== null ? 'visible' : 'hidden',
                }}
              >
                <PopoverActionContext.Provider value={actionCtxValue}>
                  {props.children}
                </PopoverActionContext.Provider>
              </m.div>
            </m.div>
          </RootPortal>
        )}
      </AnimatePresence>
    </>
  )
}
