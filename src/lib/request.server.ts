import 'server-only'

import { createElement } from 'react'
import { notFound } from 'next/navigation'
import type { FC, ReactNode } from 'react'

import { RequestError } from '@mx-space/api-client'

import { BizErrorPage } from '~/components/common/BizErrorPage'
import { NormalContainer } from '~/components/layout/container/Normal'

import { attachServerFetch } from './attach-fetch'
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

const defaultErrorRenderer = (error: any) => {
  return createElement(
    NormalContainer,
    null,
    createElement(
      'p',
      {
        className: 'text-center text-red-500',
      },
      error.message,
    ),
  )
}

export const definePrerenderPage =
  <Params extends {}>() =>
  <T = {}>(options: {
    fetcher: (params: Params) => Promise<T>
    errorRenderer?: (error: any, params: Params) => ReactNode | void
    requestErrorRenderer?: (
      error: RequestError,
      parsed: {
        status: number
        bizMessage: string
      },
      params: Params,
    ) => ReactNode | void
    Component: FC<NextPageParams<Params> & { data: T }>
    handleNotFound?: boolean
  }) => {
    const {
      errorRenderer = defaultErrorRenderer,
      fetcher,
      Component,
      handleNotFound = true,
    } = options
    return async (props: any) => {
      const { params, searchParams } = props as NextPageParams<Params, any>

      try {
        attachServerFetch()
        const data = await fetcher({
          ...params,
          ...searchParams,
        })

        return createElement(
          Component,
          {
            data,
            ...props,
          },
          props.children,
        )
      } catch (error: any) {
        // 如果在内部已经处理了 NEXT_NOT_FOUND，就不再处理

        if (error?.message === 'NEXT_NOT_FOUND') {
          notFound()
        }

        if (error instanceof RequestError) {
          if (error.status === 404 && handleNotFound) {
            notFound()
          }

          return (
            options.requestErrorRenderer?.(
              error,
              {
                bizMessage: getErrorMessageFromRequestError(error),
                status: error.status,
              },
              params,
            ) ??
            createElement(BizErrorPage, {
              status: error.status,
              bizMessage: getErrorMessageFromRequestError(error),
            })
          )
        }

        console.error('error in fetcher: ', error)
        return errorRenderer(error, params) ?? defaultErrorRenderer(error)
      }
    }
  }
