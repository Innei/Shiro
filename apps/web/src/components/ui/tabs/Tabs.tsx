import * as TabsPrimitive from '@radix-ui/react-tabs'
import type { MotionProps } from 'motion/react'
import { LayoutGroup, m } from 'motion/react'
import type { ReactNode } from 'react'
import * as React from 'react'

import { clsxm } from '~/lib/helper'

export const Root = ({
  ref: forwardedRef,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
  ref?: React.RefObject<React.ElementRef<typeof TabsPrimitive.Root> | null>
}) => (
  <TabsPrimitive.Root
    className={clsxm('flex flex-col', className)}
    ref={forwardedRef}
    {...rest}
  />
)

Root.displayName = 'Tabs.Root'

export const List = ({
  ref: forwardedRef,
  id,
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  id?: string
} & {
  ref?: React.RefObject<React.ElementRef<typeof TabsPrimitive.List> | null>
}) => (
  <TabsPrimitive.List
    id={id}
    className={clsxm('inline-flex gap-5', className)}
    ref={forwardedRef}
    {...rest}
  >
    <LayoutGroup id={id}>{children}</LayoutGroup>
  </TabsPrimitive.List>
)

List.displayName = 'Tabs.List'

export const Trigger = ({
  ref: forwardedRef,
  selected,
  focused,
  badge,
  raw,
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  selected?: boolean
  focused?: boolean
  badge?: ReactNode
  raw?: boolean
} & {
  ref?: React.RefObject<React.ElementRef<typeof TabsPrimitive.Trigger> | null>
}) => {
  if (raw) {
    return (
      <TabsPrimitive.Trigger className={className} ref={forwardedRef} {...rest}>
        {children}
      </TabsPrimitive.Trigger>
    )
  }

  return (
    <TabsPrimitive.Trigger
      className={clsxm(
        'relative flex px-2 py-1 text-sm font-bold focus:outline-hidden',
        'text-zinc-600 transition-colors duration-300 dark:text-zinc-300',
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
            'bg-zinc-100 dark:bg-zinc-600',
          )}
        />
      )}
    </TabsPrimitive.Trigger>
  )
}

Trigger.displayName = 'Tabs.Trigger'

type PagerProps = {
  index: number
}

export const Pager: Component<PagerProps & MotionProps> = ({
  index,
  className,
  children,
  ...rest
}) => (
  <m.div
    className={clsxm('flex size-full', className)}
    initial={false}
    animate={{
      x: `${-100 * index}%`,
    }}
    {...rest}
  >
    {children}
  </m.div>
)

export const Content = ({
  ref: forwardedRef,
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
  ref?: React.RefObject<React.ElementRef<typeof TabsPrimitive.Content> | null>
}) => (
  <TabsPrimitive.Content
    className={clsxm('size-full shrink-0', className)}
    ref={forwardedRef}
    {...rest}
  >
    {children}
  </TabsPrimitive.Content>
)

Content.displayName = 'Tabs.Content'
