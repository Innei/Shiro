'use client'

import { usePathname, useRouter } from 'next/navigation'

import { useIsLogged } from '~/atoms/hooks/owner'
import { StyledButton } from '~/components/ui/button'
import { getToken } from '~/lib/cookie'

import NotFound404 from '../not-found'

export default () => {
  const isLogged = useIsLogged()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="center flex flex-col">
      <NotFound404>
        {isLogged && (
          <div>
            <StyledButton
              onClick={() => {
                router.replace(`${pathname}?token=${getToken()}`)

                setTimeout(() => {
                  location.reload()
                }, 1000)
              }}
            >
              携带 Token 后查看
            </StyledButton>
          </div>
        )}
      </NotFound404>
    </div>
  )
}
