'use client'

import Link from 'next/link'
import React, { memo } from 'react'

import { FloatPopover } from '~/components/ui/float-popover'
import { clsxm } from '~/lib/helper'

import type { IHeaderMenu } from '../config'

export const MenuPopover: Component<{
  subMenu: IHeaderMenu['subMenu']
}> = memo(({ children, subMenu }) => {
  if (!subMenu) return children

  return (
    <FloatPopover
      strategy="fixed"
      placement="bottom"
      offset={10}
      headless
      popoverWrapperClassNames="z-[19] relative"
      popoverClassNames={clsxm([
        'select-none rounded-xl bg-white/60 outline-none dark:bg-neutral-900/60',
        'border border-zinc-900/5 shadow-lg shadow-zinc-800/5 backdrop-blur-md',
        'dark:border-zinc-100/10 dark:from-zinc-900/70 dark:to-zinc-800/90',
        'relative flex w-[130px] flex-col',
        'focus-visible:!ring-0',
      ])}
      triggerElement={<>{children}</>}
    >
      {subMenu.length > 0 && subMenu.map((m) => <Item key={m.title} {...m} />)}
    </FloatPopover>
  )
})
MenuPopover.displayName = 'MenuPopover'

const Item = memo(function Item(props: IHeaderMenu) {
  const { title, path, icon } = props

  return (
    <Link
      key={title}
      href={`${path}`}
      className="relative flex w-full items-center justify-around space-x-2 px-4 py-3 duration-200 hover:bg-accent/5 hover:text-accent"
      role="button"
    >
      {!!icon && <span>{icon}</span>}
      <span>{title}</span>
    </Link>
  )
})
