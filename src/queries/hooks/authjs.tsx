import { useQuery } from '@tanstack/react-query'
import { m } from 'framer-motion'
import Image from 'next/image'
import { getProviders } from 'next-auth/react'
import type { FC } from 'react'
import { Fragment, useCallback, useState } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { MotionButtonBase } from '~/components/ui/button'
import { useModalStack } from '~/components/ui/modal'
import { signIn } from '~/lib/authjs'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export const useAuthProviders = () => {
  const { data } = useQuery({
    queryKey: ['providers'],
    queryFn: getProviders,
    refetchOnMount: 'always',
    meta: {
      persist: true,
    },
  })
  return data
}
export const useHasProviders = () => {
  const providers = useAuthProviders()
  return providers && Object.keys(providers).length > 0
}

export const useOauthLoginModal = () => {
  const { present } = useModalStack()

  return useCallback(() => {
    present({
      title: '',
      overlay: true,
      clickOutsideToDismiss: true,
      CustomModalComponent: ({ children }) => <div>{children}</div>,
      content: AuthjsLoginModalContent,
    })
  }, [present])
}

export const AuthProvidersRender: FC = () => {
  const providers = useAuthProviders()
  const [authProcessingLockSet, setAuthProcessingLockSet] = useState(
    () => new Set<string>(),
  )
  return (
    <>
      {providers && (
        <ul className="flex items-center justify-center gap-3">
          {Object.keys(providers).map((provider) => (
            <li key={provider}>
              <MotionButtonBase
                disabled={authProcessingLockSet.has(provider)}
                onClick={() => {
                  if (authProcessingLockSet.has(provider)) return
                  signIn(provider)

                  setAuthProcessingLockSet((prev) => {
                    prev.add(provider)
                    return new Set(prev)
                  })
                }}
              >
                <div className="flex size-10 items-center justify-center rounded-full border bg-base-100 dark:border-neutral-700">
                  {!authProcessingLockSet.has(provider) ? (
                    <Fragment>
                      {provider === 'github' ? (
                        <GitHubBrandIcon />
                      ) : (
                        <img
                          className="size-4"
                          src={`https://authjs.dev/img/providers/${provider}.svg`}
                        />
                      )}
                    </Fragment>
                  ) : (
                    <div className="center flex">
                      <i className="loading loading-spinner loading-xs opacity-50" />
                    </div>
                  )}
                </div>
              </MotionButtonBase>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
const AuthjsLoginModalContent = () => {
  const title = useAggregationSelector((s) => s.seo.title)
  const ownerAvatar = useAggregationSelector((s) => s.user.avatar)!

  const isMobile = useIsMobile()

  const Inner = (
    <>
      <div className="-mt-24 mb-4 flex items-center justify-center md:-mt-12">
        <Image
          className="rounded-full shadow-lg"
          height={60}
          width={60}
          src={ownerAvatar}
          alt="site owner"
        />
      </div>
      <div className="-mt-0 text-center">
        登录到 <b>{title}</b>
      </div>

      <div className="mt-6">
        <AuthProvidersRender />
      </div>
    </>
  )
  if (isMobile) {
    return Inner
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10, transition: { type: 'tween' } }}
      transition={{ type: 'spring' }}
      className="absolute left-1/2 top-1/2"
    >
      <div className="w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-base-100 p-3 shadow-2xl shadow-stone-300 dark:border-neutral-700 dark:shadow-stone-800">
        {Inner}
      </div>
    </m.div>
  )
}
