'use client'

import { useEffect } from 'react'
import { domAnimation, LazyMotion } from 'framer-motion'

import { captureException } from '@sentry/nextjs'

import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'

export default function Error({ error, reset }: any) {
  useEffect(() => {
    console.log(error, reset)
    captureException(error)
  }, [error])
  return (
    <html>
      <head>
        <title>出错啦</title>
      </head>
      <body>
        <NormalContainer>
          <div>Clerk 又挂啦</div>
          <LazyMotion features={domAnimation}>
            <StyledButton onClick={reset}>重试</StyledButton>
          </LazyMotion>
        </NormalContainer>
      </body>
    </html>
  )
}
