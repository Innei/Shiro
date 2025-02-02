'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { m } from 'motion/react'
import Image from 'next/image'
import type * as React from 'react'
import { createElement } from 'react'

import { ErrorBoundary } from '~/components/common/ErrorBoundary'
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
import { isSupportIcon, SocialIcon } from '~/components/modules/home/SocialIcon'
import { usePresentSubscribeModal } from '~/components/modules/subscribe'
import { StyledButton } from '~/components/ui/button'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'
import {
  BottomToUpTransitionView,
  TextUpTransitionView,
} from '~/components/ui/transition'
import { microReboundPreset, softBouncePreset } from '~/constants/spring'
import { clsxm } from '~/lib/helper'
import { noopObj } from '~/lib/noop'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'
import {
  useAggregationSelector,
  useAppConfigSelector,
} from '~/providers/root/aggregation-data-provider'

import { ActivityPostList } from './components/ActivityPostList'
import { ActivityRecent } from './components/ActivityRecent'

export default function Home() {
  return (
    <div>
      <Hero />
      <ActivityScreen />
      <Windsock />
    </div>
  )
}
const TwoColumnLayout = ({
  children,
  leftContainerClassName,
  rightContainerClassName,
  className,
}: {
  children:
    | [React.ReactNode, React.ReactNode]
    | [React.ReactNode, React.ReactNode, React.ReactNode]

  leftContainerClassName?: string
  rightContainerClassName?: string
  className?: string
}) => {
  return (
    <div
      className={clsxm(
        'relative mx-auto block size-full min-w-0 max-w-[1800px] flex-col flex-wrap items-center lg:flex lg:flex-row',
        className,
      )}
    >
      {children.slice(0, 2).map((child, i) => {
        return (
          <div
            key={i}
            className={clsxm(
              'flex w-full flex-col center lg:h-auto lg:w-1/2',

              i === 0 ? leftContainerClassName : rightContainerClassName,
            )}
          >
            <div className="relative max-w-full lg:max-w-2xl">{child}</div>
          </div>
        )
      })}

      {children[2]}
    </div>
  )
}

const Hero = () => {
  const { title, description } = useAppConfigSelector((config) => {
    return {
      ...config.hero,
    }
  })!
  const siteOwner = useAggregationSelector((agg) => agg.user)
  const { avatar, socialIds } = siteOwner || {}

  const titleAnimateD =
    title.template.reduce((acc, cur) => {
      return acc + (cur.text?.length || 0)
    }, 0) * 50
  return (
    <div className="mt-20 min-w-0 max-w-screen overflow-hidden lg:mt-[-4.5rem] lg:h-dvh lg:min-h-[800px]">
      <TwoColumnLayout leftContainerClassName="mt-[120px] lg:mt-0 lg:h-[15rem] lg:h-1/2">
        <>
          <m.div
            className="group relative text-center leading-[4] lg:text-left [&_*]:inline-block"
            initial={{ opacity: 0.0001, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={softBouncePreset}
          >
            {title.template.map((t, i) => {
              const { type } = t
              const prevAllTextLength = title.template
                .slice(0, i)
                .reduce((acc, cur) => {
                  return acc + (cur.text?.length || 0)
                }, 0)
              return createElement(
                type,
                { key: i, className: t.class },
                t.text && (
                  <TextUpTransitionView
                    initialDelay={prevAllTextLength * 0.05}
                    eachDelay={0.05}
                  >
                    {t.text}
                  </TextUpTransitionView>
                ),
              )
            })}
          </m.div>

          <BottomToUpTransitionView
            delay={titleAnimateD + 500}
            transition={softBouncePreset}
            className="my-3 text-center lg:text-left"
          >
            <span className="opacity-80">{description}</span>
          </BottomToUpTransitionView>

          <ul className="center mx-[60px] mt-8 flex flex-wrap gap-6 lg:mx-auto lg:mt-28 lg:justify-start lg:gap-4">
            {Object.entries(socialIds || noopObj).map(
              ([type, id]: any, index) => {
                if (!isSupportIcon(type)) return null
                return (
                  <BottomToUpTransitionView
                    key={type}
                    delay={index * 100 + titleAnimateD + 500}
                    className="inline-block"
                    as="li"
                  >
                    <SocialIcon id={id} type={type} />
                  </BottomToUpTransitionView>
                )
              },
            )}
          </ul>
        </>

        <div
          className={clsx('lg:size-[300px]', 'size-[200px]', 'mt-24 lg:mt-0')}
        >
          <Image
            height={300}
            width={300}
            src={avatar!}
            alt="Site Owner Avatar"
            className={clsxm(
              'aspect-square rounded-full border border-slate-200 dark:border-neutral-800',
              'w-full',
            )}
          />
        </div>

        <m.div
          initial={{ opacity: 0.0001, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={softBouncePreset}
          className={clsx(
            'center inset-x-0 bottom-0 mt-12 flex flex-col lg:absolute lg:mt-0',

            'center text-neutral-800/80 dark:text-neutral-200/80',
          )}
        >
          <small className="text-center">
            当第一颗卫星飞向大气层外，我们便以为自己终有一日会征服宇宙。
          </small>
          <span className="mt-8 animate-bounce">
            <i className="i-mingcute-right-line rotate-90 text-2xl" />
          </span>
        </m.div>
      </TwoColumnLayout>
    </div>
  )
}

const ActivityScreen = () => {
  return (
    <div className="mt-24">
      <TwoColumnLayout
        rightContainerClassName="block lg:flex [&>div]:w-full pr-4"
        leftContainerClassName="[&>div]:w-full"
      >
        <ActivityPostList />
        <ErrorBoundary>
          <ActivityRecent />
        </ErrorBoundary>
      </TwoColumnLayout>
    </div>
  )
}

const windsock = [
  {
    title: '文稿',
    path: '/posts',
    type: 'Post',
    subMenu: [],
    icon: IcTwotoneSignpost,
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

const Windsock = () => {
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
        <div className="mb-24 opacity-90">去到别去看看？</div>
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
                whileHover={{
                  y: -10,
                  transition: {
                    ...microReboundPreset,
                    delay: 0.001,
                  },
                }}
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <a
                  href={item.path}
                  className="flex items-center gap-4 text-neutral-800 duration-200 hover:!text-accent dark:text-neutral-200"
                >
                  {createElement(item.icon, { className: 'w-6 h-6' })}
                  <span>{item.title}</span>
                </a>

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

            toast.success('谢谢你！', {
              iconElement: (
                <m.i
                  className="i-mingcute-heart-fill text-uk-red-light"
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
          喜欢本站 <i className="i-mingcute-heart-fill" />{' '}
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
          <i className="i-material-symbols-notifications-active" />
        </StyledButton>
      </div>
    </>
  )
}
