import { createElement } from 'react'
import { toast as Toast } from 'react-toastify'
import type { Id, ToastOptions, TypeOptions } from 'react-toastify'

import { ToastCard } from '~/components/modules/shared/ToastCard'

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

interface CustomToastOptions {
  iconElement?: JSX.Element
  onClick?: () => void
}
interface ToastCustom {
  success(message: string, options?: ToastOptions & CustomToastOptions): Id
  info(message: string, options?: ToastOptions & CustomToastOptions): Id
  warn(message: string, options?: ToastOptions & CustomToastOptions): Id
  error(message: string, options?: ToastOptions & CustomToastOptions): Id

  dismiss(id: Id): void
}

// @ts-ignore
export const toast: ToastCustom = (
  message: string,
  type?: TypeOptions,
  options?: ToastOptions & CustomToastOptions,
) => {
  const { iconElement, onClick, ...rest } = options || {}
  return Toast(createElement(ToastCard, { message, iconElement, onClick }), {
    type,
    ...baseConfig,
    ...rest,
  })
}
;['success', 'info', 'warn', 'error'].forEach((type) => {
  // @ts-ignore
  toast[type] = (
    message: string,
    options?: ToastOptions & CustomToastOptions,
  ) => toast(message, type as TypeOptions, options)
})

Object.assign(toast, {
  dismiss: Toast.dismiss,
})
