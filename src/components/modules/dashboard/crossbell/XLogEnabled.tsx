import { lazy, Suspense, useMemo } from 'react'

export const XLogEnable = () => {
  return 'ethereum' in window ? <XlogSwitchLazy /> : null
}

const XlogSwitchLazy = () => {
  const Component = useMemo(
    () =>
      lazy(() =>
        import('./XlogSwitch').then((mo) => ({ default: mo.XlogSwitch })),
      ),
    [],
  )
  return (
    <Suspense>
      <Component />
    </Suspense>
  )
}
