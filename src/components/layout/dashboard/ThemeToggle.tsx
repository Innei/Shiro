import { useTheme } from 'next-themes'
import { useMemo } from 'react'

import { MotionButtonBase } from '~/components/ui/button'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const currentThemeIcon = useMemo(() => {
    switch (theme) {
      case 'light': {
        return <i className="i-mingcute-sun-line" />
      }
      case 'dark': {
        return <i className="i-mingcute-moon-line" />
      }
      default: {
        return <i className="i-mingcute-computer-line" />
      }
    }
  }, [theme])

  return (
    <MotionButtonBase
      className="p-2"
      onClick={() => {
        switch (theme) {
          case 'light': {
            setTheme('dark')
            break
          }
          case 'dark': {
            setTheme('system')
            break
          }
          case 'system': {
            setTheme('light')
            break
          }
        }
      }}
    >
      {currentThemeIcon}
    </MotionButtonBase>
  )
}
