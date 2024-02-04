import 'server-only'

import { notFound } from 'next/navigation'

import { RequestError } from '@mx-space/api-client'

export const requestErrorHandler = (error: Error | RequestError) => {
  if (
    error instanceof RequestError &&
    (error.status === 404 || error.raw?.response?.status === 404)
  ) {
    return notFound()
  }
  throw error
}
