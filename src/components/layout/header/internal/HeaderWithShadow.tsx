'use client'

import clsx from 'clsx'

import { usePageScrollLocationSelector } from '~/providers/root/page-scroll-info-provider'

export const HeaderWithShadow: Component = ({ children }) => {
  const showShadow = usePageScrollLocationSelector((y) => y > 100)
  return (
    <header
      className={clsx(
        'fixed left-0 right-0 top-0 z-[9] h-[4.5rem] overflow-hidden transition-shadow duration-200',
        showShadow && 'shadow-xl shadow-neutral-100 dark:shadow-neutral-800',
      )}
    >
      {children}
    </header>
  )
}
