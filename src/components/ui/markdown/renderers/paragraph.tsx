import React from 'react'
import clsx from 'clsx'
import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react'

export const MParagraph: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = (props) => {
  const { children, ...other } = props
  const { className, ...rest } = other

  if (React.Children.count(children) === 1) {
    const child = React.Children.toArray(children)[0]
    if (typeof child === 'object') {
      if ((child as any)?.props?.src) {
        return children
      }
    }
  }
  return (
    <p className={clsx('paragraph', className)} {...rest}>
      {children}
    </p>
  )
}
