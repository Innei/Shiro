import { ThemeSwitcher } from '~/components/ui/theme-switcher'

import { FooterInfo } from './FooterInfo'

export const Footer = () => {
  return (
    <footer
      data-hide-print
      className="relative z-[1] mt-32 border-t border-x-uk-separator-opaque-light bg-[var(--root-bg)] py-6 text-base-content/80 dark:border-uk-separator-opaque-dark"
    >
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
