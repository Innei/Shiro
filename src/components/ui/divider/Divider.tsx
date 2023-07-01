import React from 'react'
import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react'

import { clsxm } from '~/lib/helper'

export const Divider: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>
> = (props) => {
  const { className, ...rest } = props
  return (
    <hr
      className={clsxm(
        'my-4 h-[0.5px] border-0 bg-always-black !bg-opacity-30 dark:bg-always-white',
        className,
      )}
      {...rest}
    />
  )
}

export const DividerVertical: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
> = (props) => {
  const { className, ...rest } = props
  return (
    <span
      className={clsxm(
        'mx-4 inline-block h-full w-[0.5px] select-none bg-always-black !bg-opacity-30 text-transparent dark:bg-always-white',
        className,
      )}
      {...rest}
    >
      w
    </span>
  )
}
