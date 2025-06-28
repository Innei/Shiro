import clsx from 'clsx'
import type { FC } from 'react'

import {
  FluentShieldError20Regular,
  FluentWarning28Regular,
  IonInformation,
} from '~/components/icons/status'

const textColorMap = {
  NOTE: 'text-blue-500 dark:text-blue-400',
  IMPORTANT: 'text-accent',
  WARNING: 'text-amber-500 dark:text-amber-400',
  TIP: 'text-green-500 dark:text-green-400',
  CAUTION: 'text-red-500 dark:text-red-400',
} as any

const borderColorMap = {
  NOTE: 'before:bg-blue-500 before:bg-blue-400',
  IMPORTANT: 'before:bg-accent',
  WARNING: 'before:bg-amber-500 dark:before:bg-amber-400',
  TIP: 'before:bg-green-500 dark:before:bg-green-400',
  CAUTION: 'before:bg-red-500 dark:before:bg-red-400',
} as any

const typedIconMap = {
  NOTE: IonInformation,
  IMPORTANT: FluentWarning28Regular,
  WARNING: FluentShieldError20Regular,
  TIP: IonInformation,
  CAUTION: FluentShieldError20Regular,
}

export const AlertIcon: FC<{
  type: keyof typeof typedIconMap
}> = ({ type }) => {
  const finalType = type || 'NOTE'
  const Icon = typedIconMap[finalType] || typedIconMap.NOTE
  const typePrefix = finalType[0] + finalType.toLowerCase().slice(1)

  return (
    <span
      className={clsx(
        'mb-1 inline-flex items-center font-semibold',
        textColorMap[finalType],
      )}
    >
      <Icon
        className={clsx(
          `shrink-0 text-3xl md:mr-2 md:self-start md:text-left`,
          typedIconMap[finalType] || typedIconMap.NOTE,
        )}
      />

      {typePrefix}
    </span>
  )
}

export const GitAlert = (props: { type: string; text: string }) => {
  const { type, text } = props

  const upperType = type.toUpperCase() as keyof typeof borderColorMap
  return (
    <blockquote
      className={clsx(
        'relative px-8 py-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-md',
        'not-prose',
        borderColorMap[upperType],

        'not-italic',
      )}
    >
      <AlertIcon type={upperType as any} />
      <br />

      {text}
    </blockquote>
  )
}
