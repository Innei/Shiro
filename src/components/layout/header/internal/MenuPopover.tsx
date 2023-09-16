'use client'

import React, { memo, useId, useMemo, useState } from 'react'
import { m } from 'framer-motion'
import Link from 'next/link'
import type { IHeaderMenu } from '../config'

import { FloatPopover } from '~/components/ui/float-popover'
import { softSpringPreset } from '~/constants/spring'
import { clsxm } from '~/lib/helper'

export const MenuPopover: Component<{
  subMenu: IHeaderMenu['subMenu']
}> = memo(({ children, subMenu }) => {
  const currentId = useId()
  const TriggerComponent = useMemo(() => () => children, [children])
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
        'shadow-lg shadow-zinc-800/5 border border-zinc-900/5 backdrop-blur-md',
        'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:border-zinc-100/10',
        'relative flex w-[130px] flex-col py-1',
        'focus-visible:!ring-0',
      ])}
      TriggerComponent={TriggerComponent}
    >
      {!!subMenu.length &&
        subMenu.map((m) => {
          return <Item key={m.title} currentId={currentId} {...m} />
        })}
    </FloatPopover>
  )
})
MenuPopover.displayName = 'MenuPopover'

const Item = memo(function Item(
  props: IHeaderMenu & {
    currentId: string
  },
) {
  const { title, path, icon, currentId } = props

  const [isEnter, setIsEnter] = useState(false)
  return (
    <Link
      key={title}
      href={`${path}`}
      className="relative flex w-full items-center justify-around space-x-2 px-4 py-3 duration-200 hover:text-accent"
      role="button"
      onMouseEnter={() => {
        setIsEnter(true)
      }}
      onMouseLeave={() => {
        setIsEnter(false)
      }}
    >
      {!!icon && <span>{icon}</span>}
      <span>{title}</span>

      {isEnter && (
        <m.span
          layoutId={currentId}
          transition={softSpringPreset}
          className={clsxm(
            'absolute bottom-0 left-0 right-2 top-0 z-[-1] rounded-md',
            'bg-zinc-50 dark:bg-neutral-900',
            'border border-zinc-200 dark:border-zinc-800',
          )}
        />
      )}
    </Link>
  )
})
