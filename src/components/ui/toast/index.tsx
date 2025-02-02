import { Toaster as Sonner } from 'sonner'

import { useIsDark } from '~/hooks/common/use-is-dark'

type ToasterProps = React.ComponentProps<typeof Sonner>

export const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme={useIsDark() ? 'dark' : 'light'}
    toastOptions={{
      className: `pointer-events-auto group font-theme`,
      classNames: {
        content: 'min-w-0 cursor-default',
        icon: `self-start translate-y-[2px]`,
        actionButton: `font-sans font-medium`,
        closeButton: `!border-border !bg-base-100 transition-opacity will-change-opacity duration-200 opacity-0 group-hover:opacity-100`,
      },
    }}
    {...props}
  />
)
