'use client'

import { ErrorBoundary as ErrorBoundaryLib } from 'react-error-boundary'
import type { FC, PropsWithChildren } from 'react'

// import { captureException } from '@sentry/nextjs'

import { StyledButton } from '../ui/button'

const FallbackComponent = () => {
  return (
    <div className="flex w-full flex-col py-6 center">
      Something went wrong. Please contract to{' '}
      <a href="mailto:i@innei.in" className="shiro-link--underline">
        i@innei.in
      </a>
      .
      <StyledButton
        onClick={() => {
          window.location.reload()
        }}
      >
        Reload Page
      </StyledButton>
    </div>
  )
}
export const ErrorBoundary: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundaryLib
      FallbackComponent={FallbackComponent}
      onError={(e) => {
        console.error(e)

        // TODO  sentry

        // captureException(e)
      }}
    >
      {children}
    </ErrorBoundaryLib>
  )
}
