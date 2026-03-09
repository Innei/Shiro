'use client'

import { useTranslations } from 'next-intl'

export const Spoiler: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const t = useTranslations('common')
  return (
    <del className="spoiler" title={t('spoiler_title')}>
      {children}
    </del>
  )
}
