'use client'

import React, { memo, useMemo } from 'react'
import Link from 'next/link'
import type { IHeaderMenu } from '../config'

import { FloatPopover } from '~/components/ui/float-popover'

export const MenuPopover: Component<{
  subMenu: IHeaderMenu['subMenu']
}> = memo(({ children, subMenu }) => {
  const TriggerComponent = useMemo(() => () => children, [children])
  if (!subMenu) return children
  return (
    <FloatPopover
      strategy="fixed"
      headless
      placement="bottom"
      offset={10}
      popoverWrapperClassNames="z-[19] relative"
      popoverClassNames="rounded-xl !p-0"
      TriggerComponent={TriggerComponent}
    >
      {!!subMenu.length && (
        <div className="relative flex w-[130px] flex-col px-4">
          {subMenu.map((m) => {
            return (
              <Link
                key={m.title}
                href={`${m.path}`}
                className="flex w-full items-center justify-around space-x-2 py-3 duration-200 hover:text-accent"
                role="button"
              >
                {!!m.icon && <span>{m.icon}</span>}
                <span>{m.title}</span>
              </Link>
            )
          })}
        </div>
      )}
    </FloatPopover>
  )
})
MenuPopover.displayName = 'MenuPopover'
