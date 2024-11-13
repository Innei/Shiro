'use client'

import { domAnimation, LazyMotion } from 'motion/react'
import { useEffect } from 'react'

// import { captureException } from '@sentry/nextjs'
import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
    // captureException(error)
  }, [error])
  return (
    <html>
      <head>
        <title>禁止访问或者 API 服务出现问题</title>
      </head>
      <body>
        <NormalContainer>
          <h1 className="mb-4">禁止访问或者 API 服务出现问题</h1>
          <div className="flex justify-center">
            <LazyMotion features={domAnimation}>
              <StyledButton onClick={() => location.reload()}>
                重试
              </StyledButton>
            </LazyMotion>
          </div>
        </NormalContainer>
      </body>
    </html>
  )
}
