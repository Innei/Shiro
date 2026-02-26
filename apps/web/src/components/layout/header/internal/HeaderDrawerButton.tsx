'use client'

import { useTranslations } from 'next-intl'
import type { CSSProperties } from 'react'

import { useIsMobile } from '~/atoms/hooks/viewport'
import { PresentSheet } from '~/components/ui/sheet'
import { useIsClient } from '~/hooks/common/use-is-client'

import { HeaderActionButton } from './HeaderActionButton'
import { HeaderDrawerContent } from './HeaderDrawerContent'
import { useMenuOpacity } from './hooks'

export const HeaderDrawerButton = () => {
  const t = useTranslations('common')
  const isClient = useIsClient()
  const isMobile = useIsMobile()
  const menuOpacity = useMenuOpacity()
  const opacityStyle: CSSProperties | undefined =
    isMobile && menuOpacity !== undefined
      ? {
          opacity: menuOpacity,
          visibility: menuOpacity === 0 ? 'hidden' : 'visible',
        }
      : undefined

  const ButtonElement = (
    <HeaderActionButton
      aria-label={t('aria_header_drawer')}
      style={opacityStyle}
    >
      <i className="i-mingcute-menu-line" />
    </HeaderActionButton>
  )
  if (!isClient) return ButtonElement

  return (
    <PresentSheet content={<HeaderDrawerContent />}>
      {ButtonElement}
    </PresentSheet>
  )
}
