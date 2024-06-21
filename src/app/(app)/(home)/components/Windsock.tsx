'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createElement } from 'react'
import { m } from 'framer-motion'
import Link from 'next/link'

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
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'

const windsock = [
  {
    title: '文稿',
    path: '/posts',
    type: 'Post',
    subMenu: [],
    icon: IcTwotoneSignpost,
    do() {
      window.__POST_LIST_ANIMATED__ = true
    },
  },
  {
    title: '手记',
    type: 'Note',
    path: '/notes',
    icon: FaSolidFeatherAlt,
  },
  {
    title: '度过的时光呀',
    icon: FaSolidHistory,
    path: '/timeline',
  },
  {
    title: '朋友们',
    icon: FaSolidUserFriends,
    path: '/friends',
  },
  {
    title: '写下一点思考',
    icon: MdiLightbulbOn20,
    path: '/thinking',
  },
  {
    title: '看看我做些啥',
    icon: MdiFlask,
    path: '/projects',
  },
  {
    title: '记录下一言',
    path: '/says',
    icon: FaSolidComments,
  },
  {
    title: '跃迁',
    icon: RMixPlanet,
    path: 'https://travel.moe/go.html',
  },
]
export const Windsock = () => {
  const likeQueryKey = ['site-like']
  const { data: count } = useQuery({
    queryKey: likeQueryKey,
    queryFn: () => apiClient.proxy('like_this').get(),
    refetchInterval: 1000 * 60 * 5,
  })

  const queryClient = useQueryClient()

  const { present: presentSubscribe } = usePresentSubscribeModal()
  return (
    <>
      <div className="center mt-28 flex flex-col">
        <div className="my-5 text-2xl font-medium">风向标</div>
        <div className="mb-24 opacity-90">去到别处看看？</div>
        <ul className="flex flex-col flex-wrap gap-2 gap-y-8 opacity-80 lg:flex-row">
          {windsock.map((item, index) => {
            return (
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
                className="flex items-center justify-between text-sm duration-200 hover:!-translate-y-2"
              >
                <Link
                  href={item.path}
                  className="flex items-center gap-4 text-neutral-800 duration-200 hover:!text-accent dark:text-neutral-200"
                  onClick={item.do}
                >
                  {createElement(item.icon, { className: 'w-6 h-6' })}
                  <span>{item.title}</span>
                </Link>

                {index != windsock.length - 1 && (
                  <span className="mx-4 hidden select-none lg:inline"> · </span>
                )}
              </m.li>
            )
          })}
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
                queryClient.setQueryData(likeQueryKey, (prev: any) => {
                  return prev + 1
                })
              })

            toast('谢谢你！', undefined, {
              iconElement: (
                <m.i
                  className="icon-[mingcute--heart-fill] text-uk-red-light"
                  initial={{
                    scale: 0.96,
                  }}
                  animate={{
                    scale: 1.22,
                  }}
                  transition={{
                    easings: ['easeInOut'],
                    delay: 0.3,
                    repeat: 5,
                    repeatDelay: 0.3,
                  }}
                />
              ),
            })
          }}
        >
          喜欢本站 <i className="icon-[mingcute--heart-fill]" />{' '}
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
          订阅
          <i className="icon-[material-symbols--notifications-active]" />
        </StyledButton>
      </div>
    </>
  )
}
