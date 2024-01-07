import React from 'react'
import { clsx } from 'clsx'
import type { FC } from 'react'

import {
  ClaritySuccessLine,
  FluentShieldError20Regular,
  FluentWarning28Regular,
  IonInformation,
} from '../../icons/status'

const IconMap = {
  warning: FluentWarning28Regular,
  info: IonInformation,
  error: FluentShieldError20Regular,
  success: ClaritySuccessLine,
}

const bgColorMap = {
  warning: 'bg-amber-50 dark:bg-amber-300',
  info: 'bg-blue-50 dark:bg-blue-300',
  success: 'bg-green-50 dark:bg-green-300',
  error: 'bg-red-50 dark:bg-red-300',
}

const borderColorMap = {
  warning: 'border-amber-300',
  info: 'border-blue-300',

  success: 'border-green-300',
  error: 'border-red-300',
}

const iconColorMap = {
  warning: 'text-amber-500',
  info: 'text-blue-500',
  success: 'text-green-500',
  error: 'text-red-500',
}

export const Banner: FC<{
  type: 'warning' | 'error' | 'success' | 'info'
  message?: string | React.ReactNode
  className?: string
  children?: React.ReactNode
  placement?: 'center' | 'left'
  showIcon?: boolean
}> = (props) => {
  const Icon = IconMap[props.type] || IconMap.info
  const { placement = 'center', showIcon = true } = props
  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-4 rounded-md border p-6 text-neutral-900 md:flex md:flex-row dark:bg-opacity-10 dark:text-[#c4c4c4]',
        bgColorMap[props.type] || bgColorMap.info,
        borderColorMap[props.type] || borderColorMap.info,
        placement == 'center' ? 'justify-center' : 'justify-start',
        props.className,
      )}
    >
      {showIcon && (
        <Icon
          className={clsx(
            `flex-shrink-0 text-3xl md:mr-2 md:self-start md:text-left`,
            iconColorMap[props.type] || iconColorMap.info,
          )}
        />
      )}
      {props.message ? (
        <span className="leading-[1.8]">{props.message}</span>
      ) : (
        props.children
      )}
    </div>
  )
}
