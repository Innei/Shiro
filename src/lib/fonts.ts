import { Manrope, Noto_Serif } from 'next/font/google'

const sansFont = Manrope({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
  display: 'swap',
})
const serifFont = Noto_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
})

export { sansFont, serifFont }
