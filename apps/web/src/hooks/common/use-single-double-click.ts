import { useEffect, useState } from 'react'

export function useSingleAndDoubleClick(
  actionSimpleClick: Function,
  actionDoubleClick: Function,
  delay = 250,
) {
  const [click, setClick] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      // simple click
      if (click === 1) actionSimpleClick()
      setClick(0)
    }, delay)

    // the duration between this click and the previous one
    // is less than the value of delay = double-click
    if (click === 2) actionDoubleClick()

    return () => clearTimeout(timer)
  }, [actionDoubleClick, actionSimpleClick, click])

  return () => setClick((prev) => prev + 1)
}
