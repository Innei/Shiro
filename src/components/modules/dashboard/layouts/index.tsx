import type { FC, PropsWithChildren } from 'react'

import { RootPortal } from '~/components/ui/portal'
import { clsxm } from '~/lib/helper'

export const MainLayout: FC<PropsWithChildren> = (props) => {
  return (
    <div className="flex min-h-screen flex-col [&>div]:flex [&>div]:flex-grow [&>div]:flex-col">
      <main className="mt-28 flex min-h-0 flex-grow flex-col p-4">
        {props.children}
      </main>
    </div>
  )
}

export const OffsetMainLayout: Component<PropsWithChildren> = (props) => {
  return (
    <div className={clsxm(props.className, '-ml-4 w-[calc(100%+2rem)] p-4')}>
      {props.children}
    </div>
  )
}

export const OffsetHeaderLayout: Component<PropsWithChildren> = (props) => {
  return (
    <RootPortal>
      <div
        className={clsxm(
          'fixed right-4 top-[4rem] z-[19] flex',
          props.className,
        )}
      >
        {props.children}
      </div>
    </RootPortal>
  )
}
