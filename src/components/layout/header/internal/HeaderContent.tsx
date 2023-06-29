'use client'

import React, { memo } from 'react'
import clsx from 'clsx'
import { m, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { IHeaderMenu } from '../config'

import { clsxm } from '~/utils/helper'

import { useHeaderConfig } from './HeaderDataConfigureProvider'
import { useMenuOpacity } from './hooks'
import { MenuPopover } from './MenuPopover'

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
  const pathname = usePathname()

  return (
    <m.nav
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
      <div className="flex bg-transparent px-4 font-medium text-zinc-800 dark:text-zinc-200 ">
        {headerMenuConfig.map((section) => {
          return (
            <HeaderMenuItem
              section={section}
              key={section.path}
              isActive={
                pathname === section.path ||
                pathname.startsWith(`${section.path}/`)
              }
            />
          )
        })}
      </div>
    </m.nav>
  )
}

const HeaderMenuItem = memo<{
  section: IHeaderMenu
  isActive: boolean
}>(({ section, isActive }) => {
  const href = section.path

  return (
    <MenuPopover subMenu={section.subMenu} key={href}>
      <AnimatedItem
        href={href}
        isActive={isActive}
        className={clsx(
          'transition-[padding]',
          // '[&:hover_.icon]:-translate-x-[calc(100%+6px)] [&:hover_.icon]:opacity-100',
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
HeaderMenuItem.displayName = 'HeaderMenuItem'

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
    <div>
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
          <m.span
            className={clsx(
              'absolute inset-x-1 -bottom-px h-px',
              'bg-gradient-to-r from-accent/0 via-accent/70 to-accent/0',
            )}
            layoutId="active-nav-item"
          />
        )}
      </Link>
    </div>
  )
}
