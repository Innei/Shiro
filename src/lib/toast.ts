import { createElement } from 'react'
import { toast as Toast } from 'react-toastify'
import type { Id, ToastOptions, TypeOptions } from 'react-toastify'

import { ToastCard } from '~/components/widgets/shared/ToastCard'

const baseConfig = {
  position: 'bottom-right',
  autoClose: 3000,
  pauseOnHover: true,
  hideProgressBar: true,

  closeOnClick: true,
  closeButton: false,
} satisfies ToastOptions

interface ToastCustom {
  (
    message: string,
    type?: TypeOptions,
    options?: ToastOptions & {
      iconElement?: JSX.Element
    },
  ): Id
}

interface ToastCustom {
  success(message: string, options?: ToastOptions): Id
  info(message: string, options?: ToastOptions): Id
  warn(message: string, options?: ToastOptions): Id
  error(message: string, options?: ToastOptions): Id
}

// @ts-ignore
export const toast: ToastCustom = (
  message: string,
  type?: TypeOptions,
  options?: ToastOptions & {
    iconElement?: JSX.Element
  },
) => {
  const { iconElement, ...rest } = options || {}
  return Toast(createElement(ToastCard, { message, iconElement }), {
    type,
    ...baseConfig,
    ...rest,
  })
}
;['success', 'info', 'warn', 'error'].forEach((type) => {
  // @ts-ignore
  toast[type] = (message: string, options?: ToastOptions) =>
    toast(message, type as TypeOptions, options)
})
