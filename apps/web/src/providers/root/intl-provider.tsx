'use client'

import { NextIntlClientProvider } from 'next-intl'
import type { PropsWithChildren } from 'react'

import { defaultLocale } from '~/i18n/config'
import messages from '~/messages/zh'

export const IntlProvider = ({ children }: PropsWithChildren) => {
  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
