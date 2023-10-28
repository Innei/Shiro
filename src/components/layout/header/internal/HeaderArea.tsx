'use client'

import { OnlyDesktop } from '~/components/ui/viewport'
import { clsxm } from '~/lib/helper'

import styles from './grid.module.css'

export const HeaderLogoArea: Component = ({ children }) => {
  return (
    <div className={clsxm('relative', styles['header--grid__logo'])}>
      <div
        className={clsxm(
          'relative flex h-full w-full items-center justify-center',
        )}
      >
        {children}
      </div>
    </div>
  )
}

export const HeaderLeftButtonArea: Component = ({ children }) => {
  return (
    <div
      className={clsxm(
        'relative flex h-full w-full items-center justify-center lg:hidden',
      )}
    >
      {children}
    </div>
  )
}

export const HeaderCenterArea: Component = ({ children }) => {
  return (
    <OnlyDesktop>
      <div className="flex min-w-0 flex-grow">
        <div className="relative flex flex-grow items-center justify-center">
          {children}
        </div>
      </div>
    </OnlyDesktop>
  )
}
