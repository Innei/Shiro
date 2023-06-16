'use client'

import React, { memo, useMemo } from 'react'
import clsx from 'clsx'
import { motion, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { IHeaderMenu } from '../config'

import { FloatPopover } from '~/components/ui/float-popover'
import { clsxm } from '~/utils/helper'

import { useHeaderConfig } from './HeaderDataConfigureProvider'
import { useMenuOpacity } from './hooks'

export const HeaderContent = () => {
  return (
    <AnimatedMenu>
      <ForDesktop />
    </AnimatedMenu>
  )
}

const AnimatedMenu: Component = ({ children }) => {
  const opacity = useMenuOpacity()

  return (
    <div
      className="duration-[100ms]"
      style={{
        opacity,
        visibility: opacity === 0 ? 'hidden' : 'visible',
      }}
    >
      {children}
    </div>
  )
}

const ForDesktop: Component = ({ className }) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const radius = useMotionValue(0)
  const handleMouseMove = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
      radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2.5)
    },
    [mouseX, mouseY, radius],
  )

  const { config: headerMenuConfig } = useHeaderConfig()

  return (
    <motion.nav
      layout="size"
      onMouseMove={handleMouseMove}
      className={clsxm(
        'relative',
        'rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90',
        'shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md',
        'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',

        className,
      )}
    >
      <ul className="flex bg-transparent px-4 font-medium text-zinc-800 dark:text-zinc-200 ">
        {headerMenuConfig.map((section) => {
          return <HeaderMenuItem section={section} key={section.path} />
        })}
      </ul>
    </motion.nav>
  )
}

const HeaderMenuItem = memo<{
  section: IHeaderMenu
}>(({ section }) => {
  const pathname = usePathname()
  const href = section.path
  const isActive = pathname === href || pathname.startsWith(`${href}/`)
  return (
    <MenuPopover subMenu={section.subMenu} key={href}>
      <AnimatedItem
        href={href}
        isActive={isActive}
        className={clsxm(
          'transition-[padding] [&:hover_.icon]:-translate-x-[calc(100%+6px)] [&:hover_.icon]:opacity-100',
          '[&.active_.icon]:-translate-x-[calc(100%+6px)] [&.active_.icon]:opacity-80',
          '[&.active]:pl-6',
        )}
      >
        <span className="relative">
          <span
            className={clsxm(
              'pointer-events-none absolute bottom-0 left-0 top-0 flex items-center opacity-0 duration-200',
              'icon',
            )}
          >
            {section.icon}
          </span>
          {section.title}
        </span>
      </AnimatedItem>
    </MenuPopover>
  )
})

const MenuPopover: Component<{
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
                href={m.path}
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

function AnimatedItem({
  href,
  children,
  className,
  isActive,
}: {
  href: string
  children: React.ReactNode
  className?: string
  isActive?: boolean
}) {
  return (
    <li>
      <Link
        href={href}
        className={clsxm(
          'relative block whitespace-nowrap px-4 py-2 transition',
          isActive ? 'text-accent' : 'hover:text-accent-focus',
          isActive ? 'active' : '',
          className,
        )}
      >
        {children}
        {isActive && (
          <motion.span
            className={clsx(
              'absolute inset-x-1 -bottom-px h-px',
              'bg-gradient-to-r from-accent/0 via-accent/70 to-accent/0',
            )}
            layoutId="active-nav-item"
          />
        )}
      </Link>
    </li>
  )
}
