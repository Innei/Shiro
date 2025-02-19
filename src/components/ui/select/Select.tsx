'use client'

import * as SelectImpl from '@radix-ui/react-select'
import type { PropsWithChildren } from 'react'
import * as React from 'react'

import { clsxm } from '~/lib/helper'

export type SelectValue<T> = {
  value: T
  label: string
}

interface SelectProps<T> {
  values: SelectValue<T>[]
  value: T
  onChange: (
    value: T,
    item: {
      value: T
      label: string
    },
  ) => void

  isLoading?: boolean
  placeholder?: string
}

export const Select = function Select<T>(
  props: SelectProps<T> & {
    className?: string
  },
) {
  const { value, className, values, onChange, isLoading, placeholder } = props
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
          'border-border inline-flex w-full items-center justify-between gap-1 rounded-lg border',
          'p-2',
          'text-[0.9em]',

          className,
        )}
      >
        <SelectImpl.Value placeholder={placeholder} />
        <SelectImpl.Icon className="flex items-center">
          {isLoading ? (
            <i className="i-mingcute-loading-line animate-spin" />
          ) : (
            <i className="i-mingcute-down-line" />
          )}
        </SelectImpl.Icon>
      </SelectImpl.Trigger>
      <SelectImpl.Portal>
        <SelectImpl.Content className="z-[990] rounded-lg border border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
          <SelectImpl.ScrollUpButton className="flex h-3 items-center justify-center">
            <i className="i-mingcute-up-line" />
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
          </SelectImpl.Viewport>
          <SelectImpl.ScrollDownButton className="flex h-3 items-center justify-center">
            <i className="i-mingcute-down-line" />
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
      className="flex cursor-auto items-center justify-between rounded-sm px-3 py-1 hover:bg-zinc-200 dark:hover:bg-neutral-800"
      {...props}
      ref={forwardedRef}
    >
      <SelectImpl.ItemText asChild>
        <span className="pointer-events-none min-w-0 select-none truncate">
          {children}
        </span>
      </SelectImpl.ItemText>

      <SelectImpl.ItemIndicator className="shrink-0">
        <i className="i-mingcute-check-line" />
      </SelectImpl.ItemIndicator>
    </SelectImpl.Item>
  )
})

SelectItem.displayName = 'SelectItem'
