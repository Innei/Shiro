import * as ScrollArea from '@radix-ui/react-scroll-area'
import { Link, useLocation } from 'react-router-dom'
import { useDarkModeDetector } from 'src/hooks/use-dark'
import type { FC } from 'react'

import { routeKeys } from '../../router'

export const Sidebar: FC = () => {
  const { pathname } = useLocation()

  return (
    <ScrollArea.Root className="z-1 !absolute inset-y-0 left-0 w-[250px] border-r border-slate-200 dark:border-neutral-800">
      <ScrollArea.Viewport className="!inline-block !w-[250px] !min-w-[auto]">
        <div className="flex h-screen flex-col">
          <h1 className="mt-4 text-center text-xl font-medium">
            Component Playground
          </h1>
          <ul className="mt-6 shrink grow space-y-2 pl-2 pr-[3px]">
            {routeKeys.map((componentName) => {
              return (
                <li
                  key={componentName}
                  className={[
                    'rounded-3xl bg-transparent transition-colors hover:bg-blue-200 dark:hover:bg-slate-700',
                    pathname === `/${componentName}`
                      ? 'bg-blue-100 dark:bg-slate-800'
                      : '',
                  ].join(' ')}
                >
                  <Link
                    to={`/${componentName}`}
                    className="block size-full px-4 py-2"
                  >
                    {componentName.at(0)?.toUpperCase() +
                      componentName
                        .slice(1)
                        .replace(/-\s*(\w)/g, (match, p1) => {
                          return ` ${p1.toUpperCase()}`
                        })}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="shrink-0">
            <DarkModeToggle />
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  )
}

const DarkModeToggle: FC = () => {
  const { value, toggle } = useDarkModeDetector()
  return (
    <button aria-label="Toggle Dark Mode" onClick={toggle}>
      {!value ? <SunIcon /> : <DarkIcon />}
    </button>
  )
}

const SunIcon = () => {
  return (
    <svg
      fill="none"
      height="24"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2" />
      <path d="M12 21v2" />
      <path d="M4.22 4.22l1.42 1.42" />
      <path d="M18.36 18.36l1.42 1.42" />
      <path d="M1 12h2" />
      <path d="M21 12h2" />
      <path d="M4.22 19.78l1.42-1.42" />
      <path d="M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

const DarkIcon = () => {
  return (
    <svg
      fill="none"
      height="24"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}
