'use client'

import { Paper } from './Paper'

const isRequestError = (error: Error) => {
  return error.message.startsWith(`Request failed with status code`)
}

const pickStatusCode = (error: Error) => {
  return error.message.split(' ').pop()
}
// TODO Catch if 404 or 403
export default ({ error, reset }: { error: Error; reset: () => void }) => {
  if (isRequestError(error)) {
    const code = pickStatusCode(error)

    if (!code) {
      return null
    }
    if (parseInt(code) === 403) {
      return <div>Need password</div>
    }
    return (
      <div>
        <h1>{code}</h1>
      </div>
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
