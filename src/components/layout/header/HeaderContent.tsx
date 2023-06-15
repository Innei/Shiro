'use client'

import React from 'react'
import { motion, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { OnlyLg } from '~/components/ui/viewport'
import { usePageScrollDirection } from '~/providers/root/page-scroll-info-provider'
import { clsxm } from '~/utils/helper'

import { useHeaderOpacity } from './BluredBackground'
import { headerMenuConfig } from './config'

export const HeaderContent = () => {
  return (
    <OnlyLg>
      <AnimatedMenu>
        <ForDesktop />
      </AnimatedMenu>
    </OnlyLg>
  )
}

const AnimatedMenu: Component = ({ children }) => {
  const scrollDirection = usePageScrollDirection()
  const headerOpacity = useHeaderOpacity()
  let opacity = 1 - headerOpacity

  if (scrollDirection === 'up') {
    opacity = 1
  }

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

function ForDesktop({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
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

  return (
    <nav
      onMouseMove={handleMouseMove}
      className={clsxm(
        'relative',
        'rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90',
        'shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md',
        'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',
        '[--spotlight-color:rgb(236_252_203_/_0.6)] dark:[--spotlight-color:rgb(217_249_157_/_0.07)]',
        className,
      )}
      {...props}
    >
      <ul className="flex bg-transparent px-4 font-medium text-zinc-800 dark:text-zinc-200 ">
        {headerMenuConfig.map((section) => {
          return (
            <NavItem
              key={section.path}
              href={section.path}
              className="[&:hover_.icon]:-translate-x-[calc(100%+6px)] [&:hover_.icon]:opacity-100"
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
            </NavItem>
          )
        })}
      </ul>
    </nav>
  )
}

function NavItem({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const isActive = usePathname() === href

  return (
    <li>
      <Link
        href={href}
        className={clsxm(
          'relative block whitespace-nowrap px-4 py-2 transition',
          isActive ? 'text-accent' : 'hover:text-accent-focus',
          className,
        )}
      >
        {children}
        {isActive && (
          <motion.span
            className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-lime-700/0 via-lime-700/70 to-lime-700/0 dark:from-lime-400/0 dark:via-lime-400/40 dark:to-lime-400/0"
            layoutId="active-nav-item"
          />
        )}
      </Link>
    </li>
  )
}
