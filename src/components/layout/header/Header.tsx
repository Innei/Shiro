import { memo } from 'react'

import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { clsxm } from '~/utils/helper'

import { AnimatedLogo } from './internal/AnimatedLogo'
import { BluredBackground } from './internal/BluredBackground'
import styles from './internal/grid.module.css'
import {
  HeaderCenterArea,
  HeaderLeftButtonArea,
  HeaderLogoArea,
} from './internal/HeaderArea'
import { HeaderContent } from './internal/HeaderContent'
import { HeaderDataConfigureProvider } from './internal/HeaderDataConfigureProvider'
import { HeaderDrawerButton } from './internal/HeaderDrawerButton'
import { HeaderMeta } from './internal/HeaderMeta'
import { SiteOwnerAvatar } from './internal/SiteOwnerAvatar'
import { UserAuth } from './internal/UserAuth'

export const Header = () => {
  return (
    <HeaderDataConfigureProvider>
      <MemoedHeader />
    </HeaderDataConfigureProvider>
  )
}

const MemoedHeader = memo(() => {
  return (
    <header className="fixed left-0 right-0 top-0 z-[9] h-[4.5rem] overflow-hidden">
      <BluredBackground />
      <div
        className={clsxm(
          'relative mx-auto grid h-full min-h-0 max-w-7xl grid-cols-[4.5rem_auto_4.5rem] lg:px-8',
          styles['header--grid'],
        )}
      >
        <HeaderLeftButtonArea>
          <HeaderDrawerButton />
        </HeaderLeftButtonArea>

        <HeaderLogoArea>
          <AnimatedLogo />
          <SiteOwnerAvatar className="absolute bottom-[10px] right-[2px] hidden lg:inline-block" />
          <OnlyMobile>
            <HeaderMeta />
          </OnlyMobile>
        </HeaderLogoArea>

        <HeaderCenterArea>
          <HeaderContent />
          <HeaderMeta />
        </HeaderCenterArea>

        <div className="flex h-full w-full items-center">
          <UserAuth />
        </div>
      </div>
    </header>
  )
})

MemoedHeader.displayName = 'MemoedHeader'
