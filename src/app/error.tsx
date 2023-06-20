'use client'

import { useEffect } from 'react'

import { captureException } from '@sentry/nextjs'

export default ({ error, reset }: any) => {
  useEffect(() => {
    captureException(error)
  }, [error])
  return <div>Something went wrong</div>
}
