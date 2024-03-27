import { GeistSans } from 'geist/font/sans'
import { Noto_Serif_SC } from 'next/font/google'

export const sansFont = GeistSans

export const serifFont = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
  // adjustFontFallback: false,
  fallback: ['Noto Serif SC'],
})
