import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { JSX } from 'react'

export const HeaderActionButton = ({
  ref,
  children,
  ...rest
}: JSX.IntrinsicElements['div'] & {
  ref?: React.RefObject<HTMLDivElement | null>
}) => {
  const t = useTranslations('common')
  return (
    <div
      role="button"
      tabIndex={1}
      className={clsx(
        'group size-10 rounded-full bg-base-100',
        'px-3 text-sm ring-1 ring-zinc-900/5 transition dark:ring-white/10 dark:hover:ring-white/20',

        'center flex',
      )}
      {...rest}
      ref={ref}
      aria-label={t('aria_header_action')}
    >
      {children}
    </div>
  )
}

HeaderActionButton.displayName = 'HeaderActionButton'
