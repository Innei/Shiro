import type { FC, JSX } from 'react'
import * as React from 'react'

import { clsxm } from '~/lib/helper'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

export const MTable: FC<JSX.IntrinsicElements['table']> = (props) => {
  const { className, ...rest } = props
  return (
    <div className="w-full min-w-0 overflow-auto">
      <table
        {...rest}
        className={clsxm('table table-zebra table-pin-rows', className)}
      />
    </div>
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

export const MTableTd: FC<JSX.IntrinsicElements['td']> = (props) => {
  const { children, ...rest } = props
  return (
    <WrappedElementProvider as="td" {...rest}>
      {children}
    </WrappedElementProvider>
  )
}
