'use client'

import { useEffect } from 'react'
import { domAnimation, LazyMotion } from 'framer-motion'

// import { captureException } from '@sentry/nextjs'

import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'

export default function Error({ error }: any) {
  useEffect(() => {
    console.log(error)
    // captureException(error)
  }, [error])
  return (
    <html>
      <head>
        <title>出错啦</title>
      </head>
      <body>
        <NormalContainer>
          <p>{error?.message || '未知错误'}</p>
          <LazyMotion features={domAnimation}>
            <StyledButton onClick={location.reload}>重试</StyledButton>
          </LazyMotion>
        </NormalContainer>
      </body>
    </html>
  )
}
