'use client'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import * as React from 'react'

import { clsxm as cn } from '~/lib/helper'

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = ({
  ref,
  className,
  inset,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
} & {
  ref?: React.RefObject<React.ElementRef<
    typeof DropdownMenuPrimitive.SubTrigger
  > | null>
}) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-xs px-2 py-1.5 text-sm outline-hidden',
      'focus:bg-zinc-100/80 data-[state=open]:bg-zinc-100 dark:focus:bg-zinc-800 dark:data-[state=open]:bg-zinc-800',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <i className="i-mingcute-down-line ml-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
)
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuContent = ({
  ref,
  className,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
  ref?: React.RefObject<React.ElementRef<
    typeof DropdownMenuPrimitive.Content
  > | null>
}) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-32 overflow-hidden rounded-md border border-neutral/50 bg-base-100 p-1 text-base-content drop-shadow',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
)
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = ({
  ref,
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  icon?: React.ReactNode
} & {
  ref?: React.RefObject<React.ElementRef<
    typeof DropdownMenuPrimitive.Item
  > | null>
}) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-hidden transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'focus:bg-neutral/30 data-[state=open]:bg-neutral/30',
      inset && 'pl-8',
      'focus-within:!outline-transparent',
      className,
    )}
    {...props}
  >
    {props.icon && (
      <span className="mr-1.5 inline-flex size-4 items-center justify-center">
        {props.icon}
      </span>
    )}
    {props.children}
    {/* Justify Fill */}
    {props.icon && <span className="ml-1.5 size-4" />}
  </DropdownMenuPrimitive.Item>
)
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuLabel = ({
  ref,
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
} & {
  ref?: React.RefObject<React.ElementRef<
    typeof DropdownMenuPrimitive.Label
  > | null>
}) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
)
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> & {
  ref?: React.RefObject<React.ElementRef<
    typeof DropdownMenuPrimitive.Separator
  > | null>
}) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-neutral/20', className)}
    {...props}
  />
)
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
    {...props}
  />
)
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
