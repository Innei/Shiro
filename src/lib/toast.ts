import { createElement } from 'react'
import { toast as Toast } from 'react-toastify'
import type { ToastOptions, TypeOptions } from 'react-toastify'

import { ToastCard } from '~/components/common/ToastCard'

export const toast = (
  message: string,
  type?: TypeOptions,
  options?: ToastOptions & {
    iconElement?: JSX.Element
  },
) => {
  const { iconElement, ...rest } = options || {}
  return Toast(createElement(ToastCard, { message, iconElement }), {
    type,
    position: 'bottom-right',
    autoClose: 3000,
    pauseOnHover: true,
    hideProgressBar: true,

    closeOnClick: true,
    closeButton: false,
    ...rest,
  })
}
