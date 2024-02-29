/* eslint-disable react/display-name */
'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

import { NotFound404 } from '~/components/common/404'
import { NotePasswordForm } from '~/components/modules/note/NotePasswordForm'
import { isRequestError, pickStatusCode } from '~/lib/is-error'
import { setCurrentNoteNid } from '~/providers/note/CurrentNoteIdProvider'

import { Paper } from '../../../components/layout/container/Paper'

// TODO Catch if 404 or 403
export default ({ error, reset }: { error: Error; reset: () => void }) => {
  useEffect(() => {
    if (!isRequestError(error)) {
      // captureException(error)
    }
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
          <NoteSetCurrnetId />
        </Paper>
      )
    }

    if (code === 404 || code === 422) {
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

const NoteSetCurrnetId = () => {
  const { id } = useParams()
  useEffect(() => {
    setCurrentNoteNid(id as string)
  }, [id])
  return null
}
