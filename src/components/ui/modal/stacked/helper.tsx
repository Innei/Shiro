import type { Context, PropsWithChildren } from 'react'
import { memo, use } from 'react'

export const InjectContext = (Context: Context<any>) => {
  const ctxValue = use(Context)
  return memo(({ children }: PropsWithChildren) => (
    <Context value={ctxValue}>{children}</Context>
  ))
}
