import { Manrope, Noto_Serif_SC, JetBrains_Mono } from 'next/font/google'

const sansFont = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

const serifFont = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
  // adjustFontFallback: false,
  fallback: ['Noto Serif SC'],
})

const JetBrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  display: 'swap',
})

export { sansFont, serifFont, JetBrainsMono }
