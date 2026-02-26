'use client'

import { OnlyDesktop } from '~/components/ui/viewport'
import { clsxm } from '~/lib/helper'

import { useHeaderBgOpacity } from './hooks'

export const HeaderLogoArea: Component = ({ children }) => {
  const headerOpacity = useHeaderBgOpacity()
  return (
    <div
      className={clsxm('relative', 'header--grid__logo')}
      style={{
        opacity: 1 - headerOpacity,
      }}
    >
      <div
        className={clsxm('relative flex size-full items-center justify-center')}
      >
        {children}
      </div>
    </div>
  )
}

export const HeaderLeftButtonArea: Component = ({ children }) => (
  <div
    className={clsxm(
      'relative flex size-full items-center justify-center lg:hidden',
    )}
  >
    {children}
  </div>
)

export const HeaderCenterArea: Component = ({ children }) => (
  <OnlyDesktop>
    <div className="flex min-w-0 grow" data-header-center>
      <div className="relative flex grow items-center justify-center">
        {children}
      </div>
    </div>
  </OnlyDesktop>
)
