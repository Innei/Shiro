'use client'

import { useEffect } from 'react'

import { captureException } from '@sentry/nextjs'

// TODO next.js not implement for now
export default ({ error, reset }: any) => {
  useEffect(() => {
    console.log(error, reset)
    captureException(error)
  }, [error])
  return (
    <html>
      <body>
        <div>Something went wrong</div>
      </body>
    </html>
  )
}
