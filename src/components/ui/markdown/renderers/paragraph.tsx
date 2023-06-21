import React from 'react'
import clsx from 'clsx'
import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react'

import { LinkRenderer } from './LinkRenderer'

export const MParagraph: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = (props) => {
  const { children, ...other } = props
  const { className, ...rest } = other

  if (React.Children.count(children) === 1) {
    // isImage
    const child = React.Children.toArray(children)[0]
    if (isImage(child)) {
      return children
    }

    // isLink
    if (isLink(child)) {
      return <LinkRenderer href={(child as any)?.props?.href} />
    }
  }
  // console.log(children)
  return (
    <p className={clsx('paragraph', className)} {...rest}>
      {children}
    </p>
  )
}

const isImage = (child: any) => {
  if (typeof child === 'object') {
    if ((child as any)?.props?.src) {
      return true
    }
  }
  return false
}
const isLink = (child: any) => {
  if (typeof child === 'object') {
    if (
      (child as any)?.props?.href &&
      (child as any)?.props?.children?.length === 1
    ) {
      return true
    }
  }
  return false
}
