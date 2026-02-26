'use client'

import * as ScrollAreaBase from '@radix-ui/react-scroll-area'
import * as React from 'react'

import { stopPropagation } from '~/lib/dom'
import { clsxm } from '~/lib/helper'

const Corner = ({
  ref: forwardedRef,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Corner> & {
  ref?: React.RefObject<React.ElementRef<typeof ScrollAreaBase.Corner> | null>
}) => (
  <ScrollAreaBase.Corner
    {...rest}
    ref={forwardedRef}
    className={clsxm('bg-primary', className)}
  />
)

Corner.displayName = 'ScrollArea.Corner'

const Thumb = ({
  ref: forwardedRef,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Thumb> & {
  ref?: React.RefObject<React.ElementRef<typeof ScrollAreaBase.Thumb> | null>
}) => (
  <ScrollAreaBase.Thumb
    {...rest}
    ref={forwardedRef}
    className={clsxm(
      'relative w-full flex-1 rounded-xl transition-colors duration-150',
      'bg-zinc-300 hover:bg-neutral-400/80',
      'active:bg-neutral-400',
      'dark:bg-neutral-500 hover:dark:bg-neutral-400/80 active:dark:bg-neutral-400',
      'before:absolute before:-left-1/2 before:-top-1/2 before:h-full before:min-h-[44]',
      'before:w-full before:min-w-[44] before:-translate-x-full before:-translate-y-full before:content-[""]',

      className,
    )}
  />
)
Thumb.displayName = 'ScrollArea.Thumb'

const Scrollbar = ({
  ref: forwardedRef,
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Scrollbar> & {
  ref?: React.RefObject<React.ElementRef<
    typeof ScrollAreaBase.Scrollbar
  > | null>
}) => {
  const { orientation = 'vertical' } = rest
  return (
    <ScrollAreaBase.Scrollbar
      {...rest}
      ref={forwardedRef}
      className={clsxm(
        'z-[10000] flex w-2.5 touch-none select-none p-0.5 mr-1',
        orientation === 'horizontal'
          ? `h-2.5 w-full flex-col`
          : `w-2.5 flex-row`,
        'animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
        className,
      )}
    >
      {children}
      <Thumb />
    </ScrollAreaBase.Scrollbar>
  )
}
Scrollbar.displayName = 'ScrollArea.Scrollbar'

const Viewport = ({
  ref: forwardedRef,
  className,
  mask,
  ...rest
}: React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Viewport> & {
  mask?: boolean
} & {
  ref?: React.RefObject<React.ElementRef<typeof ScrollAreaBase.Viewport> | null>
}) => {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement)
  return (
    <ScrollAreaBase.Viewport
      {...rest}
      ref={ref}
      className={clsxm('block size-full', mask && 'mask-scroller', className)}
    />
  )
}
Viewport.displayName = 'ScrollArea.Viewport'

const Root = ({
  ref: forwardedRef,
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Root> & {
  ref?: React.RefObject<React.ElementRef<typeof ScrollAreaBase.Root> | null>
}) => (
  <ScrollAreaBase.Root
    {...rest}
    scrollHideDelay={0}
    ref={forwardedRef}
    className={clsxm('overflow-hidden', className)}
  >
    {children}
    <Corner />
  </ScrollAreaBase.Root>
)

Root.displayName = 'ScrollArea.Root'

export const ScrollArea = ({
  ref,
  flex,
  children,
  mask,
  rootClassName,
  viewportClassName,
  scrollbarClassName,
}: React.PropsWithChildren & {
  rootClassName?: string
  viewportClassName?: string
  scrollbarClassName?: string
  flex?: boolean
  mask?: boolean
} & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <Root className={rootClassName}>
    <Viewport
      mask={mask}
      ref={ref}
      onWheel={stopPropagation}
      className={clsxm(
        flex ? '[&>div]:!flex [&>div]:!flex-col' : '',
        viewportClassName,
      )}
    >
      {children}
    </Viewport>
    <Scrollbar className={scrollbarClassName} />
  </Root>
)
