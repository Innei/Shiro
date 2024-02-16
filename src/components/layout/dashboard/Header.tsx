'use client'

import { useCallback } from 'react'
import { m } from 'framer-motion'
import { atom, useAtom, useSetAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { DashboardRoute } from '~/app/(dashboard)/routes'
import type { MouseEventHandler, ReactNode } from 'react'

import { dashboardRoutes, useParentRouteObject } from '~/app/(dashboard)/routes'
import { useIsMobile } from '~/atoms/hooks'
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
    <header className="fixed left-0 right-0 top-0 z-[19] border-b-[0.5px] border-zinc-200 bg-white/80 pl-6 backdrop-blur dark:border-neutral-900 dark:bg-zinc-900/80">
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
          <Link href="/" className="font-bold opacity-90 md:text-base">
            {title}
          </Link>
          <BreadcrumbDivider className="opacity-0 lg:opacity-20" />
        </div>

        <div className="relative flex min-w-0 flex-grow items-center justify-between">
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
    <div className="relative mr-2 flex flex-grow items-center justify-end space-x-2 lg:mr-4 lg:flex-grow-0">
      <ThemeToggle />
      <MobileMenuDrawerButton />
      <Avatar
        className="h-9 w-9 select-none rounded-full bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800"
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
        <i className="icon-[mingcute--menu-line]" />
      </MotionButtonBase>
    </PresentSheet>
  )
}

const HeaderMenu: Component = ({ className }) => {
  const setHeaderDrawer = useSetAtom(headerDrawerAtom)

  const firstLevelMenu = dashboardRoutes
    .children!.map((route) => {
      const title = route.title
      if (!title) return null

      return {
        title,
        path: route.path,
        icon: route?.icon,

        redirect: route.redirect,
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
        const dashboardPath = `/dashboard${menu.path}`
        const isActive =
          menu.path === ''
            ? pathname === '/dashboard'
            : pathname.startsWith(dashboardPath)

        return (
          <li key={dashboardPath}>
            <Link
              href={menu.redirect ?? dashboardPath}
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
  const pathname = usePathname()
  const parent = useParentRouteObject(pathname)

  if (!parent?.children?.length) return null
  return (
    <nav className="flex h-12 items-center justify-between overflow-auto lg:overflow-visible">
      <SecondaryLevelMenu menus={parent.children} />

      {/* <div className="hidden flex-shrink-0 text-xs lg:flex">
        <Breadcrumb />
      </div> */}
    </nav>
  )
}

const SecondaryLevelMenu = ({ menus }: { menus: DashboardRoute[] }) => {
  const pathname = usePathname()
  const parent = useParentRouteObject(pathname)
  if (!parent?.children?.length) return null
  return (
    <ul className="flex w-full space-x-4">
      {menus.map((route) => {
        const fullPath = `/dashboard${parent.path}${route.path!}`

        const isActive = pathname.startsWith(fullPath)

        return (
          <li key={route.path}>
            <Link
              onClick={isActive ? preventDefault : undefined}
              href={`${fullPath}`}
              className="relative flex items-center gap-1 rounded-lg px-2 py-1 duration-200 hover:bg-accent/40"
            >
              {isActive && (
                <m.span
                  layoutId="sub"
                  className="absolute inset-0 z-[-1] rounded-xl bg-accent/20"
                />
              )}
              {route.icon}
              <span>{route.title}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

// const Breadcrumb = () => {
//   const routeObject = useParentRouteObject(usePathname())
//   if (!routeObject) return null
//   const routes = [routeObject]
//   let parent = routeObject?.parent
//   while (parent) {
//     routes.unshift(parent)
//     parent = parent.parent
//   }

//   return (
//     <>
//       {routes.map((route, index) => {
//         const isLast = index === routes.length - 1

//         return (
//           <span key={route.path} className={clsx('flex items-center py-1')}>
//             <span>{route.title}</span>
//             {!isLast && <BreadcrumbDivider className="opacity-20" />}
//           </span>
//         )
//       })}
//     </>
//   )
// }
