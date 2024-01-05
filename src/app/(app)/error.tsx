'use client'

import { useEffect } from 'react'

// import { captureException } from '@sentry/nextjs'

import { NotFound404 } from '~/components/common/404'
import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'
import { isRequestError, pickStatusCode } from '~/lib/is-error'

// eslint-disable-next-line react/display-name
export default ({ error, reset }: any) => {
  useEffect(() => {
    console.log('error', error)
    // captureException(error)
  }, [error])

  if (isRequestError(error) && pickStatusCode(error) === 404) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] flex-col center">
        <NotFound404 />
      </div>
    )
  }

  return (
    <NormalContainer>
      <div className="flex min-h-[calc(100vh-10rem)] flex-col center">
        <h2 className="mb-5">Something went wrong!</h2>
        <StyledButton variant="primary" onClick={reset}>
          Try again
        </StyledButton>
      </div>
    </NormalContainer>
  )
}
