import { Toaster as Sonner } from 'sonner'

import { useIsDark } from '~/hooks/common/use-is-dark'

import { toastStylesV2 as toastStyles } from './styles-v2'

type ToasterProps = React.ComponentProps<typeof Sonner>

export const Toaster = ({ ...props }: ToasterProps) => {
  const isDark = useIsDark()

  return (
    <Sonner
      theme={isDark ? 'dark' : 'light'}
      gap={12}
      toastOptions={{
        unstyled: true,
        classNames: toastStyles,
      }}
      icons={{
        success: <i className="i-mingcute-check-circle-line" />,
        error: <i className="i-mingcute-close-circle-line" />,
        warning: <i className="i-mingcute-warning-line" />,
        info: <i className="i-mingcute-information-line" />,
        loading: <i className="i-mingcute-loading-3-line animate-spin" />,
      }}
      {...props}
    />
  )
}
