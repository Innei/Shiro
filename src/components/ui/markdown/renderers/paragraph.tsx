import clsx from 'clsx'
import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react'
import React from 'react'

export const MParagraph: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = (props) => {
  const { children, ...other } = props
  const { className, ...rest } = other
  return (
    <p className={clsx('paragraph', className)} {...rest}>
      {children}
    </p>
  )
}
