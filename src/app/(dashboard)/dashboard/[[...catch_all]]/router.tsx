import type { FC } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'

import { NotFound404 } from '~/components/common/404'
import { LayoutHeader } from '~/components/layout/dashboard/Header'
import { ComposedKBarProvider } from '~/components/layout/dashboard/Kbar'

import { DashboardLayoutContext } from '../../../../components/modules/dashboard/utils/context'
import type { DashboardRouteConfig } from '../../../../components/modules/dashboard/utils/helper'
import { buildGlobRoutes } from './route-builder'

const PREFIX = './routes'

const contextRequire = (require as any).context(
  '../../../../routes',
  true,
  /\.tsx$/,
  // 'lazy',
)

type NodeModule = {
  Component: FC
  config?: DashboardRouteConfig
  loader: () => Promise<any>
}
type RouteModule = {
  (): Promise<NodeModule>
  sync: NodeModule
}
const routeMap = {} as Record<string, RouteModule>

let allRoutes = contextRequire.keys()

allRoutes = allRoutes.slice(0, allRoutes.length / 2)
for (const key of allRoutes) {
  const module = contextRequire(key)
  // @ts-ignore
  routeMap[`${PREFIX}/${key.slice(2)}`] = () => Promise.resolve(module)
  routeMap[`${PREFIX}/${key.slice(2)}`].sync = module
}

export interface RouteItem {
  path: string
  config: DashboardRouteConfig
  children?: RouteItem[]
}

interface FileConfig {
  config: DashboardRouteConfig
}

function parseRoutes(data: Record<string, FileConfig>): RouteItem[] {
  const routes: Record<string, RouteItem> = {}

  // 首先处理所有的路由
  for (const [file, fileConfig] of Object.entries(data)) {
    const segments = file.split('/')
    const isIndex = segments.at(-1) === 'index.tsx'
    const isLayout = segments.at(-1) === 'layout.tsx'

    if (isIndex || isLayout) {
      const path = `/${segments.slice(0, -1).join('/')}`
      if (!routes[path]) {
        routes[path] = { path, config: fileConfig.config }
      }
      if (isLayout || !routes[path].config) {
        routes[path].config = fileConfig.config
      }
    }
  }

  // 构建嵌套结构
  const result: RouteItem[] = []
  for (const route of Object.values(routes)) {
    const segments = route.path.split('/').filter(Boolean)
    let currentLevel = result
    for (let i = 0; i < segments.length; i++) {
      const currentPath = `/${segments.slice(0, i + 1).join('/')}`
      let existingRoute = currentLevel.find((r) => r.path === currentPath)
      if (!existingRoute) {
        existingRoute = { ...routes[currentPath] }
        currentLevel.push(existingRoute)
      }
      if (i < segments.length - 1) {
        existingRoute.children = existingRoute.children || []
        currentLevel = existingRoute.children
      }
    }
  }

  // 递归排序
  function sortRoutes(routes: RouteItem[]) {
    routes.sort((a, b) => a.config.priority - b.config.priority)
    routes.forEach((route) => {
      if (route.children) {
        sortRoutes(route.children)
      }
    })
  }

  sortRoutes(result)

  return result
}

const tree = buildGlobRoutes(routeMap)

const keys = Object.keys(routeMap).map((key) => key.replace(`${PREFIX}/`, ''))

const nestedRouteMap: RouteItem[] = [
  // Index,
  {
    path: '/',
    config: routeMap[`${PREFIX}/index.tsx`].sync.config as DashboardRouteConfig,
  },
  ...parseRoutes(
    keys.reduce(
      (acc, key) => {
        acc[key] = {
          config: routeMap[`${PREFIX}/${key}`].sync
            .config as DashboardRouteConfig,
        }
        return acc
      },
      {} as Record<string, FileConfig>,
    ),
  ),
]

export const ClientRouter = () => {
  return <RouterProvider router={router} />
}

const DashboardLayout = () => {
  return (
    <div className="flex size-full grow flex-col">
      <DashboardLayoutContext.Provider value={nestedRouteMap}>
        <ComposedKBarProvider>
          <LayoutHeader />
          <Outlet />
        </ComposedKBarProvider>
      </DashboardLayoutContext.Provider>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: tree,
  },
  {
    path: '*',
    element: <NotFound404 />,
  },
])
