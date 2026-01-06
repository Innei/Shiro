import 'server-only'

import { RequestError } from '@mx-space/api-client'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { createElement } from 'react'

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

type ResolvedNextPageParams<P extends {}, Props = {}> = {
  params: P
} & Props

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
    Component: (
      props: ResolvedNextPageParams<Params> & { data: T; children?: ReactNode },
    ) => ReactNode | Promise<ReactNode>
    handleNotFound?: boolean
  }) => {
    const {
      errorRenderer = defaultErrorRenderer,
      fetcher,
      Component,
      handleNotFound = true,
    } = options
    return async (props: any) => {
      const params = await props.params
      const searchParams = props.searchParams ? await props.searchParams : {}

      try {
        await attachServerFetch()
        const data = await fetcher({
          ...params,
          ...searchParams,
        })

        return await Component({
          data,
          ...props,
          params,
          searchParams,
          children: props.children,
        })
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

        console.error('error in fetcher:', error)
        return errorRenderer(error, params) ?? defaultErrorRenderer(error)
      }
    }
  }
