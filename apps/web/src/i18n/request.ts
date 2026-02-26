import { getRequestConfig } from 'next-intl/server'

import defaultMessages from '../messages/zh'
import { routing } from './routing'

const defaultLocale = 'zh'

const messagesMap = {
  en: () => import('../messages/en'),
  ja: () => import('../messages/ja'),
} as const

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  const defaultReturn = {
    locale: defaultLocale,
    messages: defaultMessages,
  }
  if (!locale || !routing.locales.includes(locale as any)) {
    return defaultReturn
  }

  const messagesLoader = messagesMap[locale as keyof typeof messagesMap]
  if (!messagesLoader) {
    return defaultReturn
  }

  const messages = await messagesLoader()

  return {
    locale,
    messages: messages.default,
  }
})
