import React from 'react'
import type { FC } from 'react'

import { clsxm } from '~/lib/helper'

export const MTable: FC<JSX.IntrinsicElements['table']> = (props) => {
  const { className, ...rest } = props
  return (
    <table
      {...rest}
      className={clsxm('table table-zebra table-pin-rows', className)}
    />
  )
}

export const MTableHead: FC<JSX.IntrinsicElements['thead']> = (props) => {
  const { children, className, ...rest } = props
  return (
    <thead className={className} {...rest}>
      {children}
    </thead>
  )
}

export const MTableRow: FC<JSX.IntrinsicElements['tr']> = (props) => {
  const { children, ...rest } = props
  return <tr {...rest}>{children}</tr>
}

export const MTableBody: FC<JSX.IntrinsicElements['tbody']> = (props) => {
  const { children, ...rest } = props
  return <tbody {...rest}>{children}</tbody>
}
