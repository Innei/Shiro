export const locales = ['zh', 'en', 'ja'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'zh'
