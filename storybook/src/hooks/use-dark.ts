import { useEffect, useState } from 'react'

const isServerSide = () => false

interface DarkModeConfig {
  classNameDark?: string // A className to set "dark mode". Default = "dark".
  classNameLight?: string // A className to set "light mode". Default = "light".
  element?: HTMLElement | undefined | null // The element to apply the className. Default = `document.body`.
  storageKey?: string // Specify the `localStorage` key. Default = "darkMode". Sewt to `null` to disable persistent storage.
}

const useDarkMode = (
  initialState: boolean | undefined,
  options: DarkModeConfig,
) => {
  const {
    classNameDark = 'dark',
    classNameLight = 'light',
    storageKey,
    element,
  } = options

  const [darkMode, setDarkMode] = useState(initialState)

  useEffect(() => {
    const presentedDarkMode = storageKey
      ? isServerSide()
        ? null
        : localStorage.getItem(storageKey)
      : null

    if (presentedDarkMode !== null) {
      if (presentedDarkMode === 'true') {
        setDarkMode(true)
      } else if (presentedDarkMode === 'false') {
        setDarkMode(false)
      }
    } else if (typeof initialState === 'undefined') {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [storageKey])

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      const storageValue = localStorage.getItem(storageKey || 'darkMode')
      if (storageValue === null) {
        setDarkMode(e.matches)
      }
    }

    const storageHandler = () => {
      const storageValue = localStorage.getItem(storageKey || 'darkMode')
      if (storageValue === null) {
        setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
      } else {
        setDarkMode(storageValue === 'true')
      }
    }

    window.addEventListener('storage', storageHandler)
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handler)

    return () => {
      window.removeEventListener('storage', storageHandler)
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handler)
    }
  }, [storageKey])

  useEffect(() => {
    if (isServerSide() || typeof darkMode === 'undefined') {
      return
    }

    const $el = element || document.documentElement
    if (darkMode) {
      $el.classList.remove(classNameLight)
      $el.classList.add(classNameDark)

      $el.dataset.theme = 'dark'
    } else {
      $el.classList.remove(classNameDark)
      $el.classList.add(classNameLight)
      $el.dataset.theme = 'light'
    }
  }, [classNameDark, classNameLight, darkMode, element])

  if (isServerSide()) {
    return {
      toggle: () => {},
      value: false,
    }
  }

  return {
    value: darkMode,
    toggle: () => {
      setDarkMode((d) => {
        if (storageKey && !isServerSide()) {
          localStorage.setItem(storageKey, String(!d))
        }

        return !d
      })
    },
  }
}

const noop = () => {}

const mockElement = {
  classList: {
    add: noop,
    remove: noop,
  },
}
const darkModeKey = 'darkMode'
export const useDarkModeDetector = () => {
  const { toggle, value } = useDarkMode(undefined, {
    classNameDark: 'dark',
    classNameLight: 'light',
    storageKey: darkModeKey,
    element: (globalThis.document && document.documentElement) || mockElement,
  })

  useEffect(() => {
    const handler = () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches === value) {
        localStorage.removeItem(darkModeKey)
      }
    }
    window.addEventListener('beforeunload', handler)

    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [value])

  return {
    toggle,
    value,
  }
}
