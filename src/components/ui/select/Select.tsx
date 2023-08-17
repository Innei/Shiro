'use client'

import * as SelectImpl from '@radix-ui/react-select'
import React from 'react'
import type { PropsWithChildren } from 'react'

import { clsxm } from '~/lib/helper'

interface SelectProps<T> {
  values: { value: T; label: string }[]
  value: T
  onChange: (
    value: T,
    item: {
      value: T
      label: string
    },
  ) => void
}

export const Select = function Select<T>(
  props: SelectProps<T> & {
    className?: string
  },
) {
  const { value, className, values, onChange } = props
  return (
    <SelectImpl.Root
      // @ts-expect-error
      value={value}
      onValueChange={(value) => {
        // @ts-expect-error
        onChange(value, values.find((item) => item.value === value)!)
      }}
    >
      <SelectImpl.Trigger
        className={clsxm(
          'inline-flex w-full items-center justify-between gap-1 rounded-lg border border-neutral-400/50 dark:border-neutral-700',
          'px-2 py-1',
          'text-[0.9em]',
          className,
        )}
      >
        <SelectImpl.Value placeholder="SelectImpl a fruit…" />
        <SelectImpl.Icon>
          <i className="icon-[mingcute--down-line]" />
        </SelectImpl.Icon>
      </SelectImpl.Trigger>
      <SelectImpl.Portal>
        <SelectImpl.Content className="z-[10] rounded-lg border border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-800 dark:bg-neutral-900/60">
          <SelectImpl.ScrollUpButton className="SelectScrollButton">
            <i className="icon-[mingcute--up-line]" />
          </SelectImpl.ScrollUpButton>
          <SelectImpl.Viewport>
            {values.map((item) => (
              <SelectItem
                key={item.label + item.value}
                // @ts-expect-error
                value={item.value}
                onSelect={() => onChange(item.value, item)}
              >
                {item.label}
              </SelectItem>
            ))}
            <SelectImpl.Separator className="SelectSeparator" />
          </SelectImpl.Viewport>
          <SelectImpl.ScrollDownButton className="SelectScrollButton">
            <i className="icon-[mingcute--down-line]" />
          </SelectImpl.ScrollDownButton>
        </SelectImpl.Content>
      </SelectImpl.Portal>
    </SelectImpl.Root>
  )
}

const SelectItem = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<SelectImpl.SelectItemProps>
>(({ children, ...props }, forwardedRef) => {
  return (
    <SelectImpl.Item
      className="flex cursor-auto items-center justify-between rounded-lg px-3 py-1 hover:bg-slate-100 dark:hover:bg-neutral-800"
      {...props}
      ref={forwardedRef}
    >
      <SelectImpl.ItemText asChild>
        <span className="pointer-events-none min-w-0 select-none truncate">
          {children}
        </span>
      </SelectImpl.ItemText>

      <SelectImpl.ItemIndicator className="flex-shrink-0">
        <i className="icon-[mingcute--check-line]" />
      </SelectImpl.ItemIndicator>
    </SelectImpl.Item>
  )
})

SelectItem.displayName = 'SelectItem'
