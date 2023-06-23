'use client'

import { useEffect } from 'react'

import { captureException } from '@sentry/nextjs'

import { NotFound404 } from '~/components/common/404'
import { NotePasswordForm } from '~/components/widgets/note/NotePasswordForm'
import { isRequestError, pickStatusCode } from '~/lib/is-error'

import { Paper } from './Paper'

// TODO Catch if 404 or 403
export default ({ error, reset }: { error: Error; reset: () => void }) => {
  useEffect(() => {
    if (!isRequestError(error)) captureException(error)
  }, [error])

  if (isRequestError(error)) {
    const code = pickStatusCode(error)

    if (!code) {
      return null
    }
    if (code === 403) {
      return (
        <Paper>
          <NotePasswordForm />
        </Paper>
      )
    }

    if (code === 404) {
      return (
        <Paper className="flex flex-col items-center">
          <NotFound404 />
        </Paper>
      )
    }
    return (
      <Paper>
        <h1 className="mt-20 text-center text-3xl font-medium">{code}</h1>
      </Paper>
    )
  }

  return (
    <Paper>
      <div className="mt-20">
        <h2>Something went wrong!</h2>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </button>
      </div>
    </Paper>
  )
}
