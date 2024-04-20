'use client'

import { useEffect } from 'react'

// import { captureException } from '@sentry/nextjs'

import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'

// eslint-disable-next-line react/display-name
export default ({ error, reset }: any) => {
  useEffect(() => {
    console.error('error', error)
    // captureException(error)
  }, [error])

  return (
    <NormalContainer>
      <div className="flex min-h-[calc(100vh-10rem)] flex-col center">
        <h2 className="mb-5">
          <p>
            服务端渲染页面时出现了错误，可能是 Next.js 服务访问 API
            数据发生异常。请刷新重试。
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
