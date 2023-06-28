import { ErrorBoundary as ErrorBoundaryLib } from 'react-error-boundary'
import type { FC, PropsWithChildren } from 'react'

export const ErrorBoundary: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundaryLib
      fallback={null}
      onError={(e) => {
        console.error(e)
      }}
    >
      {children}
    </ErrorBoundaryLib>
  )
}
