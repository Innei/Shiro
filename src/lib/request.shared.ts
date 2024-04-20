import type { FetchError } from 'ofetch'

import { RequestError } from '@mx-space/api-client'

export const getErrorMessageFromRequestError = (error: RequestError) => {
  if (!(error instanceof RequestError)) return (error as Error).message
  const fetchError = error.raw as FetchError
  const messagesOrMessage = fetchError.response?._data?.message
  const bizMessage =
    typeof messagesOrMessage === 'string'
      ? messagesOrMessage
      : Array.isArray(messagesOrMessage)
        ? messagesOrMessage[0]
        : undefined

  return bizMessage || fetchError.message
}
