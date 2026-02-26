'use client'

import { useTranslations } from 'next-intl'

import { useIsOwnerLogged } from '~/atoms/hooks/owner'
import { StyledButton } from '~/components/ui/button'

import NotFound404 from '../not-found'

export default () => {
  const t = useTranslations('note')
  const isLogged = useIsOwnerLogged()

  return (
    <div className="center flex flex-col">
      <NotFound404>
        {isLogged && (
          <div>
            <StyledButton
              onClick={() => {
                location.reload()
              }}
            >
              {t('view_with_token')}
            </StyledButton>
          </div>
        )}
      </NotFound404>
    </div>
  )
}
