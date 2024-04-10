import 'server-only'

import { notFound } from 'next/navigation'

import { RequestError } from '@mx-space/api-client'

import { getErrorMessageFromRequestError } from './request.shared'

export const requestErrorHandler = (error: Error | RequestError) => {
  if (
    error instanceof RequestError &&
    (error.status === 404 || error.raw?.response?.status === 404)
  ) {
    return notFound()
  }
  throw error
}

export async function unwrapRequest<T>(requestPromise: Promise<T>): Promise<{
  data: T
  status: number
  error: null
  bizMessage?: undefined
}>
// @ts-expect-error
export async function unwrapRequest<T>(requestPromise: Promise<T>): Promise<{
  data: null
  status: number
  error: Error
  bizMessage: string
}>

export async function unwrapRequest<T>(requestPromise: Promise<T>) {
  try {
    const data = await requestPromise
    return {
      status: 200,
      data,
      error: null,
    }
  } catch (error) {
    if (error instanceof RequestError) {
      if (error.status === 404) {
        notFound()
      }

      return {
        status: error.status || 500,
        error,
        data: null,
        bizMessage: getErrorMessageFromRequestError(error),
      }
    }
    return {
      status: 500,
      error: 'Internal Server Error',
      data: null,
    }
  }
}
