import type { FC, PropsWithChildren } from 'react'

import { RootPortal } from '~/components/ui/portal'
import { clsxm } from '~/lib/helper'

export const MainLayout: FC<PropsWithChildren> = (props) => (
  <div className="flex min-h-screen flex-col [&>div]:flex [&>div]:grow [&>div]:flex-col">
    <main className="mt-28 flex min-h-0 grow flex-col p-4">
      {props.children}
    </main>
  </div>
)

export const OffsetMainLayout: Component<PropsWithChildren> = (props) => (
  <div className={clsxm(props.className, '-ml-4 w-[calc(100%+2rem)] p-4')}>
    {props.children}
  </div>
)

export const OffsetHeaderLayout: Component<PropsWithChildren> = (props) => (
  <RootPortal>
    <div className={clsxm('fixed right-4 top-16 z-[19] flex', props.className)}>
      {props.children}
    </div>
  </RootPortal>
)
