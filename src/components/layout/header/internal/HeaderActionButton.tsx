import { forwardRef } from 'react'
import clsx from 'clsx'
import type { JSX } from 'react'

export const HeaderActionButton = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements['div']
>(({ children, ...rest }, ref) => {
  return (
    <div
      role="button"
      tabIndex={1}
      className={clsx(
        'group size-10 rounded-full bg-gradient-to-b',
        'px-3 text-sm ring-1 ring-zinc-900/5 backdrop-blur transition dark:ring-white/10 dark:hover:ring-white/20',

        'center flex',
      )}
      {...rest}
      ref={ref}
      aria-label="Header Action"
    >
      {children}
    </div>
  )
})

HeaderActionButton.displayName = 'HeaderActionButton'
