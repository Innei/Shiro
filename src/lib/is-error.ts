import type { RequestError } from '@mx-space/api-client'

export const isRequestError = (error: Error): error is RequestError => {
  return error.message.startsWith(`Request failed with status code`)
}

export const pickStatusCode = (error: Error) => {
  return parseInt(error.message.split(' ').pop() || '')
}
