import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import 'dayjs/locale/ja'

import dayjs from 'dayjs'

export const init = () => {
  dayjs.locale('zh-cn')
}

export const setDayjsLocale = (locale: string) => {
  const localeMap: Record<string, string> = {
    zh: 'zh-cn',
    en: 'en',
    ja: 'ja',
  }
  dayjs.locale(localeMap[locale] || 'zh-cn')
}
