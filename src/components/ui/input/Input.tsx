import { forwardRef } from 'react'
import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'

import { clsxm } from '~/lib/helper'

export const Input = forwardRef<
  HTMLInputElement,
  Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'ref'
  >
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsxm(
        'min-w-0 flex-auto appearance-none rounded-lg border ring-accent/20 duration-200 sm:text-sm',
        'bg-base-100 px-3 py-[calc(theme(spacing.2)-1px)] placeholder:text-zinc-400 focus:outline-none focus:ring-2',
        'border-zinc-900/10 dark:border-zinc-700',
        'focus:border-accent-focus dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500',
        className,
      )}
      {...props}
    />
  )
})
Input.displayName = 'Input'
