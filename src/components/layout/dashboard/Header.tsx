'use client'

import { atom, useAtom, useSetAtom } from 'jotai'
import { m } from 'motion/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { MouseEventHandler, ReactNode } from 'react'
import { useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'

import type { RouteItem } from '~/app/(dashboard)/dashboard/[[...catch_all]]/router'
import { useIsMobile } from '~/atoms/hooks/viewport'
import { DashboardLayoutContext } from '~/components/modules/dashboard/utils/context'
import { Avatar } from '~/components/ui/avatar'
import { MotionButtonBase } from '~/components/ui/button'
import { BreadcrumbDivider } from '~/components/ui/divider'
import { PresentSheet } from '~/components/ui/sheet'
import { preventDefault } from '~/lib/dom'
import { clsxm } from '~/lib/helper'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { ThemeToggle } from './ThemeToggle'

export const LayoutHeader = () => {
  const title = useAggregationSelector((s) => s.seo.title)
  const router = useRouter()

  const ownerAvatar = useAggregationSelector((s) => s.user?.avatar)
  return (
    <header className="fixed inset-x-0 top-0 z-[19] border-b-[0.5px] border-zinc-200 bg-white/80 pl-6 backdrop-blur dark:border-neutral-900 dark:bg-zinc-900/80">
      <nav className="flex h-16 items-center">
        <div className="flex items-center space-x-1 lg:space-x-3">
          <MotionButtonBase
            onClick={() => {
              router.push('/')
            }}
            className="p-2 text-2xl"
          >
            {ownerAvatar ? (
              <Image
                src={ownerAvatar}
                className="rounded-full"
                height={28}
                width={28}
                alt="Owner Avatar"
              />
            ) : (
              '𝕄'
            )}
          </MotionButtonBase>
          <BreadcrumbDivider className="opacity-20" />
          <NextLink href="/" className="font-bold opacity-90 md:text-base">
            {title}
          </NextLink>
          <BreadcrumbDivider className="opacity-0 lg:opacity-20" />
        </div>

        <div className="relative flex min-w-0 grow items-center justify-between">
          <HeaderMenu className="hidden lg:flex" />

          <RightBar />
        </div>
      </nav>
      <SecondaryNavLine />
    </header>
  )
}

const RightBar = () => {
  const user = useAggregationSelector((s) => s.user)
  return (
    <div className="relative mr-2 flex grow items-center justify-end space-x-2 lg:mr-4 lg:grow-0">
      <ThemeToggle />
      <MobileMenuDrawerButton />
      <Avatar
        className="size-9 select-none rounded-full bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800"
        width={24}
        height={24}
        imageUrl={user?.avatar || ''}
      />
    </div>
  )
}

const headerDrawerAtom = atom(false)

const MobileMenuDrawerButton = () => {
  const isMobile = useIsMobile()

  const [isDrawerOpen, setIsDrawerOpen] = useAtom(headerDrawerAtom)
  if (!isMobile) return null

  return (
    <PresentSheet
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      content={HeaderMenu}
    >
      <MotionButtonBase
        className="!mr-2 rounded-full p-2"
        onClick={() => {
          setIsDrawerOpen(!isDrawerOpen)
        }}
      >
        <i className="i-mingcute-menu-line" />
      </MotionButtonBase>
    </PresentSheet>
  )
}

const HeaderMenu: Component = ({ className }) => {
  const setHeaderDrawer = useSetAtom(headerDrawerAtom)

  const routes = useContext(DashboardLayoutContext)
  const firstLevelMenu = routes
    .map((route) => {
      const { title, icon, redirect } = route.config
      if (!title) return null

      return {
        title,
        path: route.path,
        icon,
        redirect,
      }
    })
    .filter(Boolean) as {
    title: string
    path: string
    icon?: ReactNode
    redirect?: string
  }[]

  const pathname = usePathname()

  const onNav: MouseEventHandler<HTMLAnchorElement> = useCallback(() => {
    setHeaderDrawer(false)
  }, [])

  return (
    <ul
      className={clsxm('ml-2 items-center gap-2 [&_*]:text-[14px]', className)}
    >
      {firstLevelMenu.map((menu) => {
        const dashboardPath = `/dashboard${menu.redirect || menu.path}`

        const isActive =
          menu.path === '/'
            ? pathname === '/dashboard/' || pathname === '/dashboard'
            : pathname.startsWith(dashboardPath)

        return (
          <li key={dashboardPath}>
            <Link
              to={dashboardPath}
              onClick={isActive ? preventDefault : onNav}
              className="relative flex items-center gap-1 rounded-xl p-2 duration-200 hover:bg-accent/40"
            >
              {isActive && (
                <m.span
                  layoutId="header"
                  className="absolute inset-0 z-[-1] rounded-xl bg-accent/20"
                />
              )}
              {menu.icon}
              <span>{menu.title}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

const SecondaryNavLine = () => {
  const pathname = usePathname().replace('/dashboard', '')

  const routes = useContext(DashboardLayoutContext)

  const parent = routes.findLast((route) => {
    return pathname.startsWith(route.path)
  })

  if (!parent?.children?.length) return null
  return (
    <nav className="flex h-12 items-center justify-between overflow-auto lg:overflow-visible">
      <SecondaryLevelMenu menus={parent.children} />
    </nav>
  )
}

const SecondaryLevelMenu = ({ menus }: { menus: RouteItem[] }) => {
  const pathname = usePathname()
  return (
    <ul className="flex w-full space-x-4">
      {menus.map((route) => {
        const fullPath = `/dashboard${route.path!}`

        const isActive = pathname.startsWith(fullPath)

        return (
          <li key={route.path}>
            <Link
              onClick={isActive ? preventDefault : undefined}
              to={fullPath}
              className="relative flex items-center gap-1 rounded-lg px-2 py-1 duration-200 hover:bg-accent/40"
            >
              {isActive && (
                <m.span
                  layoutId="sub"
                  className="absolute inset-0 z-[-1] rounded-xl bg-accent/20"
                />
              )}
              {route.config.icon}
              <span>{route.config.title}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
