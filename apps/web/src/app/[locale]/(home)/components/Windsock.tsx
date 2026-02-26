'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { m } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createElement, useMemo } from 'react'

import {
  FaSolidComments,
  FaSolidFeatherAlt,
  FaSolidHistory,
  FaSolidUserFriends,
  IcTwotoneSignpost,
  MdiFlask,
  MdiLightbulbOn20,
  RMixPlanet,
} from '~/components/icons/menu-collection'
import { usePresentSubscribeModal } from '~/components/modules/subscribe'
import { StyledButton } from '~/components/ui/button'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'
import { Link } from '~/i18n/navigation'
import { preventDefault } from '~/lib/dom'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'

export const Windsock = () => {
  const t = useTranslations('common')

  const windsock = useMemo(
    () => [
      {
        title: t('windsock_posts'),
        path: '/posts',
        type: 'Post',
        subMenu: [],
        icon: IcTwotoneSignpost,
        do() {
          window.__POST_LIST_ANIMATED__ = true
        },
      },
      {
        title: t('windsock_notes'),
        type: 'Note',
        path: '/notes',
        icon: FaSolidFeatherAlt,
      },
      {
        title: t('windsock_timeline'),
        icon: FaSolidHistory,
        path: '/timeline',
      },
      {
        title: t('windsock_friends'),
        icon: FaSolidUserFriends,
        path: '/friends',
      },
      {
        title: t('windsock_thinking'),
        icon: MdiLightbulbOn20,
        path: '/thinking',
      },
      {
        title: t('windsock_projects'),
        icon: MdiFlask,
        path: '/projects',
      },
      {
        title: t('windsock_says'),
        path: '/says',
        icon: FaSolidComments,
      },
      {
        title: t('windsock_travel'),
        icon: RMixPlanet,
        path: 'https://travel.moe/go.html',
      },
    ],
    [t],
  )
  const likeQueryKey = ['site-like']
  const { data: count } = useQuery({
    queryKey: likeQueryKey,
    queryFn: () => apiClient.proxy('like_this').get(),
    refetchInterval: 1000 * 60 * 5,
  })

  const queryClient = useQueryClient()
  const navigate = useRouter()

  const { present: presentSubscribe } = usePresentSubscribeModal()
  return (
    <>
      <div className="center mt-28 flex flex-col">
        <div className="my-5 text-2xl font-medium">{t('windsock_title')}</div>
        <div className="mb-24 opacity-90">{t('windsock_subtitle')}</div>
        <ul className="flex flex-col flex-wrap gap-2 gap-y-8 opacity-80 lg:flex-row">
          {windsock.map((item, index) => (
            <m.li
              initial={{ opacity: 0.0001, y: 10 }}
              viewport={{ once: true }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  stiffness: 641,
                  damping: 23,
                  mass: 3.9,
                  type: 'spring',
                  delay: index * 0.05,
                },
              }}
              transition={{
                delay: 0.001,
              }}
              key={index}
              className="flex items-center cursor-pointer justify-between text-sm duration-200 group"
              onClick={() => {
                item.do?.()

                navigate.push(item.path)
              }}
            >
              <Link
                href={item.path}
                className="flex items-center gap-4 text-neutral duration-200 group-hover:text-accent! dark:text-neutral-200 group-hover:-translate-y-2!"
                onClick={preventDefault}
              >
                {createElement(item.icon, { className: 'w-6 h-6' })}
                <span>{item.title}</span>
              </Link>

              {index != windsock.length - 1 && (
                <span className="mx-4 hidden select-none lg:inline"> · </span>
              )}
            </m.li>
          ))}
        </ul>
      </div>

      <div className="mt-24 flex justify-center gap-4">
        <StyledButton
          className="center flex gap-2 bg-red-400"
          onClick={() => {
            apiClient
              .proxy('like_this')
              .post()
              .then(() => {
                queryClient.setQueryData(likeQueryKey, (prev: any) => prev + 1)
              })

            toast.success(t('thanks'), {
              iconElement: (
                <m.i
                  className="i-mingcute-heart-fill text-error"
                  initial={{
                    scale: 0.96,
                  }}
                  animate={{
                    scale: 1.22,
                  }}
                  transition={{
                    ease: 'easeInOut',
                    delay: 0.3,
                    repeat: 5,
                    repeatDelay: 0.3,
                  }}
                />
              ),
            })
          }}
        >
          {t('like_site')} <i className="i-mingcute-heart-fill" />{' '}
          <NumberSmoothTransition>
            {count as any as string}
          </NumberSmoothTransition>
        </StyledButton>

        <StyledButton
          className="center flex gap-2"
          onClick={() => {
            presentSubscribe()
          }}
        >
          {t('subscribe')}
          <i className="i-material-symbols-notifications-active" />
        </StyledButton>
      </div>
    </>
  )
}
