'use client'

import { useTheme } from 'next-themes'
import { tv } from 'tailwind-variants'

import { useIsClient } from '~/hooks/common/use-is-client'

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
export const ThemeSwitcher = () => {
  return (
    <div className="relative inline-block">
      <ButtonGroup />
      <ThemeIndicator />
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
      className="absolute top-[4px] h-[32px] w-[32px] rounded-full bg-neutral/50 duration-200"
      style={{
        left: { light: 4, system: 36, dark: 68 }[theme],
      }}
    />
  )
}

const ButtonGroup = () => {
  const { setTheme } = useTheme()
  return (
    <div
      role="radiogroup"
      className="w-fit-content inline-flex rounded-full border border-gray-400 p-[3px]"
    >
      <button
        aria-checked="false"
        aria-label="Switch to light theme"
        data-active="false"
        data-theme-switcher="true"
        role="radio"
        type="button"
        className={styles({})}
        onClick={() => {
          setTheme('light')
        }}
      >
        <SunIcon />
      </button>
      <button
        aria-checked="true"
        aria-label="Switch to system theme"
        className={styles({})}
        data-active="true"
        data-theme-switcher="true"
        role="radio"
        type="button"
        onClick={() => {
          setTheme('system')
        }}
      >
        <SystemIcon />
      </button>
      <button
        aria-checked="false"
        aria-label="Switch to dark theme"
        className={styles({})}
        data-active="false"
        data-theme-switcher="true"
        role="radio"
        type="button"
        onClick={() => {
          setTheme('dark')
        }}
      >
        <DarkIcon />
      </button>
    </div>
  )
}
