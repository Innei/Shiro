import { ThemeSwitcher } from '~/components/ui/theme-switcher'

import { FooterInfo } from './FooterInfo'

export const Footer = () => {
  return (
    <footer className="relative z-[1] mt-32 border-t border-x-uk-separator-opaque-light bg-uk-grouped-primary-light py-6 text-primary-content/95 dark:border-uk-separator-opaque-dark dark:bg-uk-grouped-secondary-dark">
      <div className="px-4 sm:px-8">
        <div className="relative mx-auto max-w-7xl lg:px-8">
          <FooterInfo />

          <div className="mt-6 block text-center md:absolute md:bottom-0 md:right-0 md:mt-0">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  )
}
