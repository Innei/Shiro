import { useQuery } from '@tanstack/react-query'
import { m } from 'framer-motion'
import Image from 'next/image'
import { getProviders } from 'next-auth/react'
import { useCallback, useState } from 'react'

import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { MotionButtonBase } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { useModalStack } from '~/components/ui/modal'
import { signIn } from '~/lib/authjs'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export const useAuthProviders = () => {
  const { data } = useQuery({
    queryKey: ['providers'],
    queryFn: getProviders,
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
      title: 'Sign in',
      overlay: true,
      clickOutsideToDismiss: true,
      CustomModalComponent: ({ children }) => <div>{children}</div>,
      content: AuthjsLoginModalContent,
    })
  }, [present])
}
const AuthjsLoginModalContent = () => {
  const title = useAggregationSelector((s) => s.seo.title)
  const ownerAvatar = useAggregationSelector((s) => s.user.avatar)!
  const providers = useAuthProviders()

  const [modalElement, setModalElement] = useState<HTMLDivElement | null>(null)
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: 'spring' }}
      className="absolute left-1/2 top-1/2"
      ref={setModalElement}
    >
      <div className="w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-base-100 p-3 shadow-2xl shadow-stone-300 dark:border-neutral-700 dark:shadow-stone-800">
        <div className="-mt-12 mb-4 flex items-center justify-center">
          <Image
            className="rounded-full shadow-lg"
            height={60}
            width={60}
            src={ownerAvatar}
            alt="site owner"
          />
        </div>
        <div className="text-center">
          登录到 <b>{title}</b>
        </div>

        {providers && (
          <ul className="mt-6 flex items-center justify-center gap-3 pb-16 md:pb-3">
            {Object.keys(providers).map((provider) => (
              <li key={provider}>
                <FloatPopover
                  type="tooltip"
                  to={modalElement!}
                  triggerElement={
                    <MotionButtonBase onClick={() => signIn(provider)}>
                      <div className="flex size-10 items-center justify-center rounded-full border dark:border-neutral-700">
                        {provider === 'github' ? (
                          <GitHubBrandIcon />
                        ) : (
                          <img
                            className="size-4"
                            src={`https://authjs.dev/img/providers/${provider}.svg`}
                          />
                        )}
                      </div>
                    </MotionButtonBase>
                  }
                >
                  {providers[provider].name}
                </FloatPopover>
              </li>
            ))}
          </ul>
        )}
      </div>
    </m.div>
  )
}
