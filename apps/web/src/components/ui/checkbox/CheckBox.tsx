'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { AnimatePresence, m } from 'motion/react'
import type { FC } from 'react'
import { useCallback, useId, useState } from 'react'

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  className?: string
}

const Checkbox: FC<CheckboxProps> = ({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  ...props
}) => {
  const [internal, setInternal] = useState<boolean | 'indeterminate'>(
    checked ?? defaultChecked ?? false,
  )

  const isChecked = checked !== undefined ? checked : internal

  const handleChange = useCallback(
    (next: boolean | 'indeterminate') => {
      setInternal(next)
      onCheckedChange?.(next)
    },
    [onCheckedChange],
  )

  return (
    <CheckboxPrimitive.Root
      checked={isChecked}
      onCheckedChange={handleChange}
      disabled={disabled}
      asChild
      {...props}
    >
      <m.button
        type="button"
        className={clsx(
          'inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border outline-none transition-colors duration-200',
          'focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-white',
          'data-[state=unchecked]:border-zinc-300 data-[state=unchecked]:bg-base-100 dark:data-[state=unchecked]:border-zinc-600',
          className,
        )}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        <AnimatePresence mode="wait">
          {isChecked === true && (
            <CheckboxPrimitive.Indicator forceMount asChild>
              <m.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3.5"
                stroke="currentColor"
                className="size-3"
                initial="unchecked"
                animate="checked"
                exit="unchecked"
              >
                <m.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                  variants={{
                    checked: {
                      pathLength: 1,
                      opacity: 1,
                      transition: { duration: 0.2, delay: 0.1 },
                    },
                    unchecked: {
                      pathLength: 0,
                      opacity: 0,
                      transition: { duration: 0.15 },
                    },
                  }}
                />
              </m.svg>
            </CheckboxPrimitive.Indicator>
          )}
          {isChecked === 'indeterminate' && (
            <CheckboxPrimitive.Indicator forceMount asChild>
              <m.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3.5"
                stroke="currentColor"
                className="size-3"
              >
                <m.line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 0.2 },
                  }}
                />
              </m.svg>
            </CheckboxPrimitive.Indicator>
          )}
        </AnimatePresence>
      </m.button>
    </CheckboxPrimitive.Root>
  )
}

const CheckBoxLabel: FC<{
  label: string
  checked?: boolean
  onCheckChange?: (checked: boolean) => void
  disabled?: boolean
}> = ({ label, checked, disabled, onCheckChange }) => {
  const id = useId()
  return (
    <div className="inline-flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(v) => {
          if (typeof v === 'boolean') onCheckChange?.(v)
        }}
      />
      <label
        htmlFor={id}
        className={clsx(
          'cursor-default select-none text-sm text-zinc-500',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {label}
      </label>
    </div>
  )
}

export { Checkbox, CheckBoxLabel }
export type { CheckboxProps }
