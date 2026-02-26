'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

// import { captureException } from '@sentry/nextjs'
import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'

export default ({ error, reset }: any) => {
  const t = useTranslations('error')
  useEffect(() => {
    console.error('error', error)
    // captureException(error)
  }, [error])

  return (
    <NormalContainer>
      <div className="center flex min-h-[calc(100vh-10rem)] flex-col">
        <h2 className="mb-5 text-center">
          <p>{t('render_error')}</p>
          <p>
            {t('render_error_contact')} <a href="mailto:i@innei.in">Innei</a>
            {t('render_error_thanks')}
          </p>
        </h2>
        <StyledButton variant="primary" onClick={() => location.reload()}>
          {t('refresh')}
        </StyledButton>
      </div>
    </NormalContainer>
  )
}
