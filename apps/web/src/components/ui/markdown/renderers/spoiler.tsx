'use client'

import { useTranslations } from 'next-intl'

export const Spoiler: React.FC<{
  children: React.ReactNode
  key?: React.Key
}> = ({ children, key }) => {
  const t = useTranslations('common')
  return (
    <del key={key} className="spoiler" title={t('spoiler_title')}>
      {children}
    </del>
  )
}
