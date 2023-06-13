import { ThemeSwitcher } from '~/components/ui/theme-switcher'

import { FooterInfo } from './FooterInfo'

export const Footer = () => {
  return (
    <footer className="relative z-[1] mt-32 border-t border-base-200 bg-uk-grouped-primary-light py-6 dark:bg-uk-grouped-primary-dark">
      <FooterInfo />

      <div className="mt-6 block text-center md:absolute md:bottom-6 md:right-6 md:mt-0">
        <ThemeSwitcher />
      </div>
    </footer>
  )
}
