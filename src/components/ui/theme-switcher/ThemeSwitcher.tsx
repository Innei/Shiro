'use client'

import { useCallback } from 'react'
import { atom } from 'jotai'
import { useTheme } from 'next-themes'
import { tv } from 'tailwind-variants'

import { useIsClient } from '~/hooks/common/use-is-client'
import { isUndefined } from '~/lib/_'
import { jotaiStore } from '~/lib/store'

const styles = tv({
  base: 'rounded-inherit inline-flex h-[32px] w-[32px] items-center justify-center border-0 text-current',
  variants: {
    status: {
      active: '',
    },
  },
})

const iconClassNames = 'h-4 w-4 text-current'

const SunIcon = () => {
  return (
    <svg
      className={iconClassNames}
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

const SystemIcon = () => {
  return (
    <svg
      className={iconClassNames}
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
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
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
      className={iconClassNames}
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

const mousePositionAtom = atom({ x: 0, y: 0 })
export const ThemeSwitcher = () => {
  const handleClient: React.MouseEventHandler = useCallback((e) => {
    jotaiStore.set(mousePositionAtom, {
      x: e.clientX,
      y: e.clientY,
    })
  }, [])
  return (
    <div className="relative inline-block" onClick={handleClient}>
      <ThemeIndicator />
      <ButtonGroup />
    </div>
  )
}

const ThemeIndicator = () => {
  const { theme } = useTheme()

  const isClient = useIsClient()

  if (!isClient) return null
  if (!theme) return null
  return (
    <div
      className="absolute top-[4px] z-[-1] h-[32px] w-[32px] rounded-full bg-base-100 shadow-[0_1px_2px_0_rgba(127.5,127.5,127.5,.2),_0_1px_3px_0_rgba(127.5,127.5,127.5,.1)] duration-200"
      style={{
        left: { light: 4, system: 36, dark: 68 }[theme],
      }}
    />
  )
}

const ButtonGroup = () => {
  const { setTheme } = useTheme()

  const buildThemeTransition = (theme: 'light' | 'dark' | 'system') => {
    if (
      !('startViewTransition' in document) ||
      window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
    ) {
      setTheme(theme)
      return
    }

    const $document = document.documentElement

    const mousePosition = jotaiStore.get(mousePositionAtom)
    const { x, y } = mousePosition

    if (isUndefined(x) && isUndefined(y)) return

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    document
      .startViewTransition(() => {
        setTheme(theme)
        return Promise.resolve()
      })
      ?.ready.then(() => {
        if (mousePosition.x === 0) return
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]

        $document.animate(
          {
            clipPath,
          },
          {
            duration: 300,
            easing: 'ease-in',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
  }

  return (
    <div className="w-fit-content inline-flex rounded-full border border-slate-200 p-[3px] dark:border-neutral-800">
      <button
        aria-label="Switch to light theme"
        type="button"
        className={styles.base}
        onClick={() => {
          buildThemeTransition('light')
        }}
      >
        <SunIcon />
      </button>
      <button
        aria-label="Switch to system theme"
        className={styles.base}
        type="button"
        onClick={() => {
          buildThemeTransition('system')
        }}
      >
        <SystemIcon />
      </button>
      <button
        aria-label="Switch to dark theme"
        className={styles.base}
        type="button"
        onClick={() => {
          buildThemeTransition('dark')
        }}
      >
        <DarkIcon />
      </button>
    </div>
  )
}
