'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'

import type { Locale } from '~/i18n/config'
import { locales } from '~/i18n/config'
import { usePathname, useRouter } from '~/i18n/navigation'

import { LanguageSelector } from '../../ui/language-selector'

export const LocaleSwitcher = () => {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const localeLabels: Record<Locale, string> = useMemo(
    () => ({
      zh: t('locale_zh'),
      en: t('locale_en'),
      ja: t('locale_ja'),
    }),
    [t],
  )

  const languages = useMemo(
    () =>
      locales.map((l) => ({
        code: l,
        label: localeLabels[l],
      })),
    [localeLabels],
  )

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      router.push(pathname, { locale: newLocale })
    },
    [pathname, router],
  )

  return (
    <LanguageSelector
      languages={languages}
      currentLanguage={locale}
      onLanguageChange={handleLocaleChange}
    />
  )
}
