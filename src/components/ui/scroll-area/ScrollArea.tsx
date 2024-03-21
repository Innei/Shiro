/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
/* eslint-disable tailwindcss/no-unnecessary-arbitrary-value */
import * as ScrollAreaBase from '@radix-ui/react-scroll-area'
import * as React from 'react'

import { clsxm } from '~/lib/helper'

const Corner = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Corner>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Corner>
>(({ className, ...rest }, forwardedRef) => (
  <ScrollAreaBase.Corner
    {...rest}
    ref={forwardedRef}
    className={clsxm('bg-primary', className)}
  />
))

Corner.displayName = 'ScrollArea.Corner'

const Thumb = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Thumb>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Thumb>
>(({ className, ...rest }, forwardedRef) => (
  <ScrollAreaBase.Thumb
    {...rest}
    ref={forwardedRef}
    className={clsxm(
      'relative w-full flex-1 rounded-xl transition-colors duration-150',
      'bg-gray-300 hover:bg-primary/80 dark:bg-neutral-500',
      'active:bg-primary/50',
      'before:absolute before:-left-[50%] before:-top-[50%] before:h-full before:min-h-[44]',
      'before:w-full before:min-w-[44] before:-translate-x-full before:-translate-y-full before:content-[""]',
      className,
    )}
  />
))
Thumb.displayName = 'ScrollArea.Thumb'

export const Scrollbar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Scrollbar>
>(({ className, children, ...rest }, forwardedRef) => {
  const { orientation = 'vertical' } = rest
  return (
    <ScrollAreaBase.Scrollbar
      {...rest}
      ref={forwardedRef}
      className={clsxm(
        'z-[10000] flex w-2.5 touch-none select-none p-0.5',
        orientation === 'horizontal'
          ? `h-2.5 w-full flex-col`
          : `w-2.5 flex-row`,
        className,
      )}
    >
      {children}
      <Thumb />
    </ScrollAreaBase.Scrollbar>
  )
})
Scrollbar.displayName = 'ScrollArea.Scrollbar'

export const Viewport = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Viewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Viewport>
>(({ className, ...rest }, forwardedRef) => (
  <ScrollAreaBase.Viewport
    {...rest}
    ref={forwardedRef}
    className={clsxm('block size-full', className)}
  />
))
Viewport.displayName = 'ScrollArea.Viewport'

export const Root = React.forwardRef<
  React.ElementRef<typeof ScrollAreaBase.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaBase.Root>
>(({ className, children, ...rest }, forwardedRef) => (
  <ScrollAreaBase.Root
    {...rest}
    ref={forwardedRef}
    className={clsxm('overflow-hidden', className)}
  >
    {children}
    <Corner />
  </ScrollAreaBase.Root>
))

Root.displayName = 'ScrollArea.Root'
export const ScrollArea: React.FC<
  React.PropsWithChildren & {
    rootClassName?: string
    viewportClassName?: string
  }
> = ({ children, rootClassName, viewportClassName }) => {
  return (
    <Root className={rootClassName}>
      <Viewport className={viewportClassName}>{children}</Viewport>
      <Scrollbar />
    </Root>
  )
}
