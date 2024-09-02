'use client'

import type { FC, PropsWithChildren } from 'react'
import { ErrorBoundary as ErrorBoundaryLib } from 'react-error-boundary'

// import { captureException } from '@sentry/nextjs'
import { StyledButton } from '../ui/button'

const FallbackComponent = () => (
  <div className="center flex w-full flex-col py-6">
    <p>
      客户端组件渲染时报错，请尝试刷新页面，如果多次出现错误请联系开发者
      <a href="mailto:i@innei.in" className="shiro-link--underline">
        i@innei.in
      </a>
      .
    </p>
    <StyledButton
      onClick={() => {
        window.location.reload()
      }}
    >
      刷新
    </StyledButton>
  </div>
)
export const ErrorBoundary: FC<PropsWithChildren> = ({ children }) => (
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
