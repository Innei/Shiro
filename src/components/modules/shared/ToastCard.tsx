'use client'

import clsx from 'clsx'
import { m } from 'framer-motion'
import type { FC } from 'react'
import type { ToastProps, TypeOptions } from 'react-toastify/dist/types'

import { MotionButtonBase } from '../../ui/button'

const typeMap: Record<TypeOptions, JSX.Element> = {
  success: <i className="icon-[mingcute--check-fill] text-uk-green-light" />,
  error: <i className="icon-[mingcute--close-fill] text-uk-red-light" />,
  info: <i className="icon-[mingcute--information-fill] text-uk-blue-light" />,
  warning: <i className="icon-[mingcute--alert-fill] text-uk-orange-light" />,
  default: (
    <i className="icon-[mingcute--information-fill] text-uk-blue-light" />
  ),
}

export const ToastCard: FC<{
  message: string
  toastProps?: ToastProps
  iconElement?: JSX.Element
  closeToast?: () => void
  onClick?: () => void
}> = (props) => {
  const { iconElement, message, closeToast, onClick } = props

  const MotionTag = onClick ? m.button : m.div

  return (
    <MotionTag
      layout="position"
      className={clsx(
        'relative w-full overflow-hidden rounded-xl shadow-md shadow-slate-200 dark:shadow-stone-800',
        'my-4 mr-4 px-4 py-5 pr-7',
        'bg-slate-50/90 backdrop-blur-sm dark:bg-neutral-900/90',
        'border border-slate-100/80 dark:border-neutral-900/80',
        'space-x-4',
        'flex items-center',
        'select-none',
        '[&>i]:flex-shrink-0',
        '[&>svg]:flex-shrink-0',
      )}
      onClick={onClick}
    >
      {iconElement ?? typeMap[props.toastProps?.type ?? 'default']}
      <span className="text-left">{message}</span>

      <MotionButtonBase
        aria-label="Close toast"
        className="absolute bottom-0 right-3 top-0 flex items-center text-sm text-base-content/40 duration-200 hover:text-base-content/80"
        onClick={(e) => {
          e.stopPropagation()
          closeToast?.()
        }}
      >
        <i className="icon-[mingcute--close-fill] p-2" />
      </MotionButtonBase>
    </MotionTag>
  )
}
