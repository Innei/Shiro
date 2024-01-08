import { lazy } from 'react'

const XLogEnableImpl = lazy(() =>
  import('./XlogSwitch').then((mo) => ({ default: mo.XlogSwitch })),
)
export const XLogEnable = () => {
  return 'ethereum' in window ? <XLogEnableImpl /> : null
}
