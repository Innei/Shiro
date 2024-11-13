import * as TabsPrimitive from '@radix-ui/react-tabs'
import type { MotionProps } from 'motion/react'
import { LayoutGroup, m } from 'motion/react'
import type { ReactNode } from 'react'
import * as React from 'react'

import { clsxm } from '~/lib/helper'

export const Root = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...rest }, forwardedRef) => (
  <TabsPrimitive.Root
    className={clsxm('flex flex-col', className)}
    ref={forwardedRef}
    {...rest}
  />
))

Root.displayName = 'Tabs.Root'

export const List = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    id?: string
  }
>(({ id, className, children, ...rest }, forwardedRef) => (
  <TabsPrimitive.List
    id={id}
    className={clsxm('inline-flex gap-5', className)}
    ref={forwardedRef}
    {...rest}
  >
    <LayoutGroup id={id}>{children}</LayoutGroup>
  </TabsPrimitive.List>
))

List.displayName = 'Tabs.List'

export const Trigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    selected?: boolean
    focused?: boolean
    badge?: ReactNode
    raw?: boolean
  }
>(
  (
    { selected, focused, badge, raw, className, children, ...rest },
    forwardedRef,
  ) => {
    if (raw) {
      return (
        <TabsPrimitive.Trigger
          className={className}
          ref={forwardedRef}
          {...rest}
        >
          {children}
        </TabsPrimitive.Trigger>
      )
    }

    return (
      <TabsPrimitive.Trigger
        className={clsxm(
          'relative flex px-2 py-1 text-sm font-bold focus:outline-none',
          'text-gray-600 transition-colors duration-300 dark:text-gray-300',
          selected && 'text-accent',
          className,
        )}
        ref={forwardedRef}
        {...rest}
      >
        <span className="z-10 inline-flex items-center gap-1">{children}</span>

        <div className="absolute right-0 top-0 z-20 -translate-y-1/2 translate-x-1/2">
          {badge}
        </div>

        {selected && (
          <m.span
            layoutId="tab-selected-underline"
            className="absolute -bottom-1 h-0.5 w-[calc(100%-16px)] rounded bg-accent"
          />
        )}

        {focused && (
          <m.span
            transition={{
              layout: {
                duration: 0.2,
                ease: 'easeOut',
              },
            }}
            layoutId="tab-focused-highlight"
            className={clsxm(
              'absolute inset-0 z-0 size-full rounded-md',
              'bg-gray-100 dark:bg-gray-600',
            )}
          />
        )}
      </TabsPrimitive.Trigger>
    )
  },
)

Trigger.displayName = 'Tabs.Trigger'

type PagerProps = {
  index: number
}

export const Pager: Component<PagerProps & MotionProps> = ({
  index,
  className,
  children,
  ...rest
}) => {
  return (
    <m.div
      className={clsxm('flex size-full', className)}
      initial={false}
      animate={{
        x: `${-100 * index}%`,
      }}
      transition={{
        tension: 190,
        friction: 70,
        mass: 0.4,
      }}
      {...rest}
    >
      {children}
    </m.div>
  )
}

export const Content = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, children, ...rest }, forwardedRef) => (
  <TabsPrimitive.Content
    className={clsxm('size-full shrink-0', className)}
    ref={forwardedRef}
    {...rest}
  >
    {children}
  </TabsPrimitive.Content>
))

Content.displayName = 'Tabs.Content'
