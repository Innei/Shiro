'use client'

import { tv } from 'tailwind-variants'

export const inputStyles = tv({
  base: 'h-[150px] w-full rounded-lg bg-gray-100/80 dark:bg-zinc-900/80',
  variants: {
    type: {
      auth: 'flex center',
      input: '',
    },
  },
})
