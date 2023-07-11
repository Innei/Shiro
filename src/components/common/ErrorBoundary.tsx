'use client'

import { ErrorBoundary as ErrorBoundaryLib } from 'react-error-boundary'
import type { FC, PropsWithChildren } from 'react'

import { captureException } from '@sentry/nextjs'

const Noop = () => null
export const ErrorBoundary: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundaryLib
      FallbackComponent={Noop}
      onError={(e) => {
        console.error(e)

        // TODO  sentry

        captureException(e)
      }}
    >
      {children}
    </ErrorBoundaryLib>
  )
}
