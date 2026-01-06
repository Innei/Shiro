import 'server-only'

import { RequestError } from '@mx-space/api-client'
import { notFound } from 'next/navigation'
import type { FC, ReactNode } from 'react'
import { createElement } from 'react'

import { BizErrorPage } from '~/components/common/BizErrorPage'
import { NormalContainer } from '~/components/layout/container/Normal'
import { API_URL } from '~/constants/env'

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

const defaultErrorRenderer = (error: any) =>
  createElement(
    NormalContainer,
    null,
    createElement(
      'p',
      {
        className: 'text-center',
      },
      error.message?.replace(API_URL, '<API_URL>'),
    ),
  )

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
    Component: FC<
      NextPageExtractedParams<Params> & {
        data: T
        fetchedAt: string
        searchParams: any
      }
    >

    handleNotFound?: boolean
  }) => {
    const {
      errorRenderer = defaultErrorRenderer,
      fetcher,
      Component,
      handleNotFound = true,
    } = options
    return async (props: any) => {
      const { params: params_, searchParams: searchParams_ } =
        props as NextPageParams<Params, any>
      const params = await params_
      const searchParams = await searchParams_

      try {
        await attachServerFetch()
        const data = await fetcher({
          ...params,
          ...searchParams,
        })

        return createElement(
          await Component,
          {
            data,
            fetchedAt: new Date().toISOString(),
            ...props,
            params: {
              ...params,
              ...searchParams,
            },
          },
          props.children,
        )
      } catch (error: any) {
        // 如果在内部已经处理了 NEXT_NOT_FOUND，就不再处理
        // @see next/packages/next/src/client/components/http-access-fallback/http-access-fallback.ts
        if (error?.message === 'NEXT_HTTP_ERROR_FALLBACK;404') {
          throw error
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
