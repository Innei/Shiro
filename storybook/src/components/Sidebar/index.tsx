import * as ScrollArea from '@radix-ui/react-scroll-area'
import { Link, useLocation } from 'react-router-dom'
import type { FC } from 'react'

import { routeKeys } from '../../router'

export const Sidebar: FC = () => {
  const { pathname } = useLocation()
  return (
    <ScrollArea.Root className="z-1 border-muted-100 !absolute bottom-0 left-0 top-0 w-[250px] border-r">
      <ScrollArea.Viewport className="!inline-block !w-[250px] !min-w-[auto]">
        <div className="flex h-screen flex-col">
          <h1 className="mt-4 text-center text-xl font-medium">
            Component Playground
          </h1>
          <ul className="mt-6 space-y-2 pl-2 pr-[3px]">
            {routeKeys.map((componentName) => {
              return (
                <li
                  key={componentName}
                  className={[
                    'rounded-3xl bg-transparent transition-colors hover:bg-blue-200 dark:bg-blue-800',
                    pathname === `/${componentName}`
                      ? 'bg-blue-100 dark:bg-blue-700'
                      : '',
                  ].join(' ')}
                >
                  <Link
                    to={`/${componentName}`}
                    className="block h-full w-full px-4 py-2"
                  >
                    {componentName.at(0)?.toUpperCase() +
                      componentName.slice(1)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  )
}
