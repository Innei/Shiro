import { ThemeSwitcher } from '~/components/ui/theme-switcher'

import { FooterInfo } from './FooterInfo'

export const Footer = () => {
  return (
    <footer className="relative z-[1] mt-32 border-t border-uk-separator-opaque-light bg-uk-grouped-primary-light py-6 dark:border-uk-separator-opaque-dark dark:bg-uk-grouped-secondary-dark">
      <FooterInfo />

      <div className="mt-6 block text-center md:absolute md:bottom-6 md:right-6 md:mt-0">
        <ThemeSwitcher />
      </div>
    </footer>
  )
}
