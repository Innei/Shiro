import type { JSX } from 'react'

import { clsxm } from '~/lib/helper'

export const Paper: Component<{
  as?: keyof JSX.IntrinsicElements | Component
}> = ({ children, className, as: As = 'main' }) => {
  return (
    <As
      className={clsxm(
        'relative bg-white dark:bg-zinc-900 md:col-start-1 lg:col-auto',
        '-m-4 p-[2rem_1rem] md:m-0 lg:p-[30px_45px]',
        'rounded-[0_6px_6px_0] border-zinc-200/70 shadow-sm dark:border-neutral-800 dark:shadow-[#333] lg:border',
        'note-layout-main',
        'min-w-0',
        'print:!border-none print:!bg-transparent print:!shadow-none',
        className,
      )}
    >
      {children}
    </As>
  )
}
