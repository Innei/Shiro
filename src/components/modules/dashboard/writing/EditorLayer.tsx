import type { FC, ReactNode } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { RootPortal } from '~/components/ui/portal'
import { clsxm } from '~/lib/helper'

export const EditorLayer: FC<{
  children: ReactNode[]
  mainClassName?: string
}> = (props) => {
  const { children, mainClassName } = props
  const [TitleEl, HeaderEl, ContentEl, FooterEl, ...rest] = children

  const isMobile = useIsMobile()
  return (
    <>
      <div className="flex flex-wrap items-center justify-between lg:mb-5">
        <div className="flex items-center justify-between">
          <p className="flex items-center text-lg font-medium">{TitleEl}</p>
        </div>

        {isMobile ? (
          <RootPortal>
            <div className="fixed right-4 top-28 z-20 flex shrink-0 grow gap-2 text-right lg:gap-4">
              {HeaderEl}
            </div>
          </RootPortal>
        ) : (
          <div className="flex shrink-0 grow gap-2 text-right lg:gap-4">
            {HeaderEl}
          </div>
        )}
      </div>

      <main
        className={clsxm(
          'flex grow lg:grid lg:grid-cols-[auto_400px] lg:gap-4',
          mainClassName,
        )}
      >
        <div className="flex grow flex-col overflow-hidden">{ContentEl}</div>

        {FooterEl}
      </main>
      {rest}
    </>
  )
}
