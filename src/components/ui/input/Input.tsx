import { forwardRef } from 'react'
import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'

import { useInputComposition } from '~/hooks/common/use-input-composition'
import { clsxm } from '~/lib/helper'

// This composition handler is not perfect
// @see https://foxact.skk.moe/use-composition-input
export const Input = forwardRef<
  HTMLInputElement,
  Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'ref'
  >
>(({ className, ...props }, ref) => {
  const inputProps = useInputComposition(props)
  return (
    <input
      ref={ref}
      className={clsxm(
        'min-w-0 flex-auto appearance-none rounded-lg border ring-accent/20 duration-200 sm:text-sm',
        'bg-base-100 px-3 py-[calc(theme(spacing.2)-1px)] placeholder:text-zinc-400 focus:outline-none focus:ring-2',
        'border-zinc-900/10 dark:border-zinc-700',
        'focus:border-accent/80 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500',
        props.type === 'password' ? 'font-mono' : 'font-[system-ui]',
        className,
      )}
      {...props}
      {...inputProps}
    />
  )
})
Input.displayName = 'Input'
