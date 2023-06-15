import { memo } from 'react'

import { BluredBackground } from './BluredBackground'
import { HeaderContent } from './HeaderContent'
import { HeaderDataConfigureProvider } from './HeaderDataConfigureProvider'
import { Logo } from './Logo'
import { SiteOwnerAvatar } from './SiteOwnerAvatar'
import { UserAuth } from './UserAuth'

export const Header = () => {
  return (
    <HeaderDataConfigureProvider>
      <MemoedHeader />
    </HeaderDataConfigureProvider>
  )
}

const MemoedHeader = memo(() => {
  return (
    <header className="fixed left-0 right-0 top-0 z-[9] h-[4.5rem]">
      <BluredBackground />
      <div className="relative mx-auto grid h-full min-h-0 max-w-7xl grid-cols-[4.5rem_auto_4.5rem] lg:px-8">
        <div className="relative">
          <Logo />
          <SiteOwnerAvatar />
        </div>
        <div className="flex min-w-0 flex-grow">
          <div className="flex flex-grow items-center justify-center">
            <HeaderContent />
          </div>
        </div>
        <div className="flex items-center">
          <UserAuth />
        </div>
      </div>
    </header>
  )
})

MemoedHeader.displayName = 'MemoedHeader'
