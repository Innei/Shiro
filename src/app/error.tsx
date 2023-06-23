'use client'

import { useEffect } from 'react'

import { captureException } from '@sentry/nextjs'

import { NotFound404 } from '~/components/common/404'
import { isRequestError, pickStatusCode } from '~/lib/is-error'

export default ({ error, reset }: any) => {
  useEffect(() => {
    captureException(error)
  }, [error])

  if (isRequestError(error) && pickStatusCode(error) === 404) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] flex-col center">
        <NotFound404 />
      </div>
    )
  }

  return (
    <div>
      <h2>Something went wrong!</h2>
    </div>
  )
}
