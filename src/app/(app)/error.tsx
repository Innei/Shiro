'use client'

import { useEffect } from 'react'

// import { captureException } from '@sentry/nextjs'

import { NotFound404 } from '~/components/common/404'
import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'
import { isRequestError, pickStatusCode } from '~/lib/is-error'

// eslint-disable-next-line react/display-name
export default ({ error, reset }: any) => {
  useEffect(() => {
    console.error('error', error)
    // captureException(error)
  }, [error])

  if (isRequestError(error) && pickStatusCode(error) === 404) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] flex-col center">
        <NotFound404 />
      </div>
    )
  }

  return (
    <NormalContainer>
      <div className="flex min-h-[calc(100vh-10rem)] flex-col center">
        <h2 className="mb-5">
          <p>
            服务端渲染页面时出现了错误，可能是 Next.js 服务访问 API
            超时。请刷新重试。
          </p>
          <p>
            多次出现错误请联系开发者 <a href="mailto:i@innei.in">Innei</a>
            ，谢谢！
          </p>
        </h2>
        <StyledButton variant="primary" onClick={() => location.reload()}>
          刷新
        </StyledButton>
      </div>
    </NormalContainer>
  )
}
