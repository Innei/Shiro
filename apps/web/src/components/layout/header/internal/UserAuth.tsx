'use client'

import { AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { CSSProperties } from 'react'
import { Fragment } from 'react'

import { getAdminUrl } from '~/atoms'
import { useIsOwnerLogged } from '~/atoms/hooks/owner'
import { useSessionReader } from '~/atoms/hooks/reader'
import { useIsMobile } from '~/atoms/hooks/viewport'
import { UserArrowLeftIcon } from '~/components/icons/user-arrow-left'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { EllipsisHorizontalTextWithTooltip } from '~/components/ui/typography'
import { useIsClient } from '~/hooks/common/use-is-client'
import { authClient } from '~/lib/authjs'
import { apiClient } from '~/lib/request'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'
import { useHasProviders, useOauthLoginModal } from '~/queries/hooks/authjs'

import { HeaderActionButton } from './HeaderActionButton'
import { useMenuOpacity } from './hooks'
import { UserAuthFromIcon } from './UserAuthFromIcon'

const OwnerAvatar = () => {
  const ownerAvatar = useAggregationSelector((s) => s.user.avatar)!

  return (
    <div className="pointer-events-auto relative flex items-center justify-center">
      <Image
        className="rounded-full"
        height={36}
        width={36}
        src={ownerAvatar}
        alt="site owner"
      />
      <UserAuthFromIcon className="absolute -bottom-1 right-0" />
    </div>
  )
}
export function UserAuth() {
  const t = useTranslations('common')
  const isOwner = useIsOwnerLogged()
  const isClient = useIsClient()
  const session = useSessionReader()
  const isMobile = useIsMobile()
  const menuOpacity = useMenuOpacity()
  const opacityStyle: CSSProperties | undefined =
    isMobile && menuOpacity !== undefined
      ? {
          opacity: menuOpacity,
          visibility: menuOpacity === 0 ? 'hidden' : 'visible',
        }
      : undefined
  const hasProviders = useHasProviders()

  const presentOauthModal = useOauthLoginModal()

  if (!isClient) return null

  return (
    <AnimatePresence>
      <div style={opacityStyle}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {isOwner ? (
              <OwnerAvatar />
            ) : session ? (
              <ReaderAvatar />
            ) : (
              hasProviders && (
                <HeaderActionButton
                  onClick={() => {
                    presentOauthModal()
                  }}
                  aria-label={t('aria_login')}
                >
                  <UserArrowLeftIcon className="size-4" />
                </HeaderActionButton>
              )
            )}
          </DropdownMenuTrigger>

          {(session || isOwner) && (
            <DropdownMenuPortal>
              <DropdownMenuContent
                sideOffset={8}
                align="end"
                className="relative flex max-w-[30ch] flex-col"
              >
                {session && (
                  <Fragment>
                    <DropdownMenuLabel className="text-xs text-base-content/60">
                      {t('auth_account')}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel className="min-w-0">
                      <div className="-mt-1 flex min-w-0 items-center gap-2">
                        <img
                          src={session.image}
                          className="size-8 rounded-full"
                        />
                        <div className="min-w-0 max-w-40 leading-none">
                          <div className="truncate">{session.name}</div>
                          <EllipsisHorizontalTextWithTooltip className="min-w-0 truncate text-xs text-base-content/60">
                            {session?.handle
                              ? `@${session.handle}`
                              : session?.email}
                          </EllipsisHorizontalTextWithTooltip>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </Fragment>
                )}

                {isOwner && (
                  <Fragment>
                    <DropdownMenuItem
                      onClick={() => {
                        window.open('/dashboard', '_blank')
                      }}
                      icon={
                        <i className="i-mingcute-dashboard-3-line size-4" />
                      }
                    >
                      {t('auth_dashboard')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const adminUrl = getAdminUrl()
                        if (adminUrl) {
                          window.open(adminUrl, '_blank')
                        }
                      }}
                      icon={
                        <i className="i-mingcute-dashboard-2-line size-4" />
                      }
                    >
                      {t('auth_console')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </Fragment>
                )}
                <DropdownMenuItem
                  onClick={async () => {
                    await apiClient.owner.logout().catch(() => {})
                    await authClient.signOut().then((res) => {
                      if (res.data?.success) window.location.reload()
                    })
                  }}
                  icon={<i className="i-mingcute-exit-line size-4" />}
                >
                  {t('auth_logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          )}
        </DropdownMenu>
      </div>
    </AnimatePresence>
  )
}

const ReaderAvatar = () => {
  const session = useSessionReader()!

  return (
    <div className="pointer-events-auto relative flex items-center justify-center">
      <Image
        className="rounded-full"
        height={36}
        width={36}
        src={session.image}
        alt={session.name}
      />
      <UserAuthFromIcon className="absolute -bottom-1 right-0" />
    </div>
  )
}
