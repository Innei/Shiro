'use client'

import { useTranslations } from 'next-intl'

export const NotSupport: Component<{
  text?: string
}> = ({ text }) => {
  const t = useTranslations('common')
  return (
    <div className="flex h-[100px] items-center justify-center text-lg font-medium">
      {text || t('not_support')}
    </div>
  )
}
