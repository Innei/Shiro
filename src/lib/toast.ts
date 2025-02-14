'use client'
import type { JSX } from 'react'
import { jsx } from 'react/jsx-runtime'
import type { ExternalToast } from 'sonner'
import { toast as sonnerToast } from 'sonner'

const defaultOptions: ExternalToast = {
  duration: 3000,
  closeButton: true,
}
interface CustomToastOptions {
  iconElement?: JSX.Element
  onClick?: () => void
  autoClose?: number | false
}

type SonnerType = 'success' | 'error' | 'info' | 'warning'
const iconNodeMap: Record<SonnerType, JSX.Element> = {
  success: jsx('i', { className: 'i-mingcute-check-fill' }),
  error: jsx('i', { className: 'i-mingcute-close-fill' }),
  info: jsx('i', {
    className: 'i-mingcute-information-fill',
  }),
  warning: jsx('i', {
    className: 'i-mingcute-alert-fill',
  }),
}

const toast = {} as {
  success: (
    message: string,
    options?: ExternalToast & CustomToastOptions,
  ) => ReturnType<typeof sonnerToast.success>
  info: (
    message: string,
    options?: ExternalToast & CustomToastOptions,
  ) => ReturnType<typeof sonnerToast.info>
  warn: (
    message: string,
    options?: ExternalToast & CustomToastOptions,
  ) => ReturnType<typeof sonnerToast.warning>
  error: (
    message: string,
    options?: ExternalToast & CustomToastOptions,
  ) => ReturnType<typeof sonnerToast.error>
  dismiss: (id?: string | number) => void
}
;['success', 'info', 'warn', 'error'].forEach((type) => {
  // @ts-ignore
  toast[type] = (
    message: string,
    options?: ExternalToast & CustomToastOptions,
  ) => {
    // const toastCaller = toast.ca
    const map = {
      success: sonnerToast.success,
      info: sonnerToast.info,
      warn: sonnerToast.warning,
      error: sonnerToast.error,
    }

    const finalIconElement =
      options?.iconElement || iconNodeMap[type as SonnerType]

    const finalDuration =
      typeof options?.autoClose === 'number'
        ? options.autoClose
        : typeof options?.autoClose === 'boolean'
          ? options.autoClose === false
            ? Infinity
            : defaultOptions.duration
          : defaultOptions.duration
    return map[type as keyof typeof map](message, {
      ...defaultOptions,
      duration: finalDuration,
      icon: finalIconElement,
      ...options,
    })
  }
})

toast.dismiss = sonnerToast.dismiss

export { toast }
