'use client'

import { useQuery } from '@tanstack/react-query'
import React, { createElement, forwardRef, useCallback, useRef } from 'react'
import clsx from 'clsx'
import { m, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { LinkModel } from '@mx-space/api-client'
import type { PropsWithChildren } from 'react'

import { LinkState, LinkType } from '@mx-space/api-client'

import { isSupportIcon, SocialIcon } from '~/components/modules/home/SocialIcon'
import { PeekLink } from '~/components/modules/peek/PeekLink'
import { PostMetaBar } from '~/components/modules/post'
import { MotionButtonBase } from '~/components/ui/button'
import { RelativeTime } from '~/components/ui/relative-time'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { TextUpTransitionView } from '~/components/ui/transition/TextUpTransitionView'
import {
  microReboundPreset,
  softBouncePreset,
  softSpringPreset,
} from '~/constants/spring'
import { shuffle } from '~/lib/_'
import { isDev } from '~/lib/env'
import { clsxm } from '~/lib/helper'
import { noopObj } from '~/lib/noop'
import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'
import {
  useAggregationSelector,
  useAppConfigSelector,
} from '~/providers/root/aggregation-data-provider'

import { useHomeQueryData } from './query'

const debugStyle = {
  outline: '1px solid #0088cc',
}
const Screen = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    className?: string
  }>
>((props, ref) => {
  const inViewRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(inViewRef, { once: true })

  return (
    <div
      ref={ref}
      style={isDev ? debugStyle : undefined}
      className={clsxm(
        'relative flex h-screen min-h-[900px] flex-col center',
        props.className,
      )}
    >
      <span ref={inViewRef} />
      {inView && props.children}
    </div>
  )
})
Screen.displayName = 'Screen'

export default function Home() {
  return (
    <div>
      <Welcome />

      <PostScreen />

      <NoteScreen />
      <FriendScreen />
      <MoreScreen />
    </div>
  )
}
const TwoColumnLayout = ({
  children,
  leftContainerClassName,
  rightContainerClassName,
}: {
  children:
    | [React.ReactNode, React.ReactNode]
    | [React.ReactNode, React.ReactNode, React.ReactNode]

  leftContainerClassName?: string
  rightContainerClassName?: string
}) => {
  return (
    <div className="relative flex h-full w-full flex-col flex-wrap items-center lg:flex-row">
      {children.slice(0, 2).map((child, i) => {
        return (
          <div
            key={i}
            className={clsxm(
              'flex h-1/2 w-full flex-col center lg:h-auto lg:w-1/2',

              i === 0 ? leftContainerClassName : rightContainerClassName,
            )}
          >
            <div className="relative max-w-full lg:max-w-xl">{child}</div>
          </div>
        )
      })}

      {children[2]}
    </div>
  )
}

const Welcome = () => {
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
    <Screen className="mt-20 lg:mt-[-4.5rem]">
      <TwoColumnLayout leftContainerClassName="mt-[120px] lg:mt-0 h-[15rem] lg:h-1/2">
        <>
          <m.div
            className="group relative leading-[4] [&_*]:inline-block"
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
            className="my-3"
          >
            <span className="opacity-80">{description}</span>
          </BottomToUpTransitionView>

          <ul className="mt-8 flex space-x-4 center lg:mt-[7rem] lg:block">
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
          className={clsx('lg:h-[300px] lg:w-[300px]', 'h-[200px] w-[200px]')}
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
            'absolute bottom-0 left-0 right-0 flex flex-col center',

            'text-neutral-800/80 center dark:text-neutral-200/80',
          )}
        >
          <small>
            当第一颗卫星飞向大气层外，我们便以为自己终有一日会征服宇宙。
          </small>
          <span className="mt-8 animate-bounce">
            <i className="icon-[mingcute--right-line] rotate-90 text-2xl" />
          </span>
        </m.div>
      </TwoColumnLayout>
    </Screen>
  )
}

const PostScreen = () => {
  const { posts } = useHomeQueryData()
  return (
    <Screen className="h-fit min-h-[120vh]">
      <TwoColumnLayout leftContainerClassName="h-[30rem] lg:h-1/2">
        <m.h2
          initial={{
            opacity: 0.0001,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={softSpringPreset}
          className="text-3xl font-medium leading-loose"
        >
          这里记录着对技术的洞察与创新，是追求未来无限可能的见证。
        </m.h2>
        <div>
          <ul className="space-y-4">
            {posts.map((post, i) => {
              const imageSrc = post.images?.[0]?.src

              return (
                <m.li
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  initial={{ opacity: 0.001, x: 50 }}
                  transition={{
                    ...softSpringPreset,
                    delay: 0.3 + 0.2 * i,
                  }}
                  key={post.id}
                  className={clsx(
                    'relative h-[100px] w-full overflow-hidden rounded-md',
                    'border border-slate-200 dark:border-neutral-700/80',
                    'group p-4 pb-0',
                  )}
                >
                  <Link
                    className="flex h-full w-full flex-col"
                    href={routeBuilder(Routes.Post, {
                      category: post.category.slug,
                      slug: post.slug,
                    })}
                  >
                    <h4 className="truncate text-xl font-medium">
                      {post.title}
                    </h4>
                    <PostMetaBar meta={post} className="-mb-2" />

                    <MotionButtonBase className="absolute bottom-4 right-4 flex items-center p-2 text-accent/95 opacity-0 duration-200 group-hover:opacity-100">
                      阅读全文
                      <i className="icon-[mingcute--arrow-right-line]" />
                    </MotionButtonBase>

                    {!!imageSrc && (
                      <div
                        aria-hidden
                        className="mask-cover absolute inset-0 top-0 z-[-1]"
                      >
                        <div
                          className="absolute inset-0 h-full w-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${imageSrc})`,
                          }}
                        />
                      </div>
                    )}
                  </Link>
                </m.li>
              )
            })}
          </ul>

          <m.div
            initial={{ opacity: 0.0001, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ...softBouncePreset,
              delay: 0.3 + 0.2 * posts.length,
            }}
            className="relative mt-12 w-full text-center"
          >
            <MotionButtonBase>
              <Link
                className="shiro-link--underline"
                href={routeBuilder(Routes.Posts, {})}
              >
                还有更多，要不要看看？
              </Link>
            </MotionButtonBase>
          </m.div>
        </div>
      </TwoColumnLayout>
    </Screen>
  )
}

const NoteScreen = () => {
  const { notes } = useHomeQueryData()
  const theLast = notes[0]

  const hasHistory = notes.length > 1

  const history = hasHistory ? notes.slice(1) : []

  if (!theLast) return null
  return (
    <Screen>
      <TwoColumnLayout leftContainerClassName="block lg:flex">
        <div className="mt-12 lg:mt-0">
          <section className="flex flex-col justify-end">
            <m.h3
              className="mb-6 text-center text-2xl"
              initial={{ opacity: 0.0001, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={softBouncePreset}
            >
              看看我的近况，我的所思所想、所作所为
            </m.h3>
            <Link href={routeBuilder(Routes.Note, { id: theLast.nid })}>
              <m.div
                initial={{ opacity: 0.00001, scale: 0.94, y: 20 }}
                animate={{
                  y: 0,
                  scale: 1,
                  opacity: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  ...softSpringPreset,
                  delay: 0.3,
                }}
                className={clsx(
                  'relative flex h-[150px] w-full rounded-md ring-1 ring-slate-200 center dark:ring-neutral-800',
                  'hover:shadow-md hover:shadow-slate-100 dark:hover:shadow-neutral-900',
                )}
              >
                <div className="absolute bottom-6 right-6 ">
                  <h4 className="font-3xl text-lg font-medium ">
                    {theLast.title}
                  </h4>

                  <small className="mt-1 block w-full text-right">
                    <RelativeTime date={theLast.created} />
                  </small>
                </div>

                {!!theLast.images?.[0]?.src && (
                  <div
                    className="mask-top absolute inset-0 bg-cover bg-center opacity-50"
                    style={{
                      background: `url(${theLast.images[0].src})`,
                    }}
                  />
                )}
              </m.div>
            </Link>
          </section>

          {hasHistory && (
            <section className="mt-[20%]">
              <m.div
                initial={{ opacity: 0.0001, y: 50 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{
                  ...softBouncePreset,
                  delay: 0.5,
                }}
                className="text-lg"
              >
                这里还有一些历史回顾
              </m.div>
              <ul className="shiro-timeline mt-4">
                {history.map((note, i) => {
                  return (
                    <m.li
                      key={note.id}
                      initial={{ opacity: 0.0001, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        ...microReboundPreset,
                        delay: 0.8 + 0.1 * i,
                      }}
                      className="flex min-w-0 justify-between"
                    >
                      <PeekLink
                        className="min-w-0 flex-shrink truncate"
                        href={routeBuilder(Routes.Note, { id: note.nid })}
                      >
                        {note.title}
                      </PeekLink>

                      <span className="ml-2 flex-shrink-0 self-end text-xs opacity-70">
                        <RelativeTime
                          date={note.created}
                          displayAbsoluteTimeAfterDay={180}
                        />
                      </span>
                    </m.li>
                  )
                })}
              </ul>

              <m.div
                className="mt-8"
                initial={{ opacity: 0.00001, scale: 0.96, y: 10 }}
                animate={{
                  y: 0,
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  ...softSpringPreset,
                  delay: 1,
                }}
              >
                <MotionButtonBase>
                  <Link
                    className="shiro-link--underline"
                    href={routeBuilder(Routes.Posts, {})}
                  >
                    还有更多，要不要看看？
                  </Link>
                </MotionButtonBase>
              </m.div>
            </section>
          )}
        </div>
        <m.h2
          className="text-3xl font-medium leading-loose"
          initial={{ opacity: 0.0001 }}
          animate={{
            opacity: 1,
          }}
        >
          而在这里，你会看到一个不同的我，
          <br />
          一个在生活中发现美，感受痛苦，洞察人性的我。
        </m.h2>
      </TwoColumnLayout>
    </Screen>
  )
}

const FriendScreen = () => {
  const { data } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      return apiClient.friend.getAll().then((res) => {
        return res.data
      })
    },
    select: useCallback((data: LinkModel[]) => {
      return shuffle(
        data.filter(
          (i) =>
            i.type === LinkType.Friend && i.state === LinkState.Pass && !i.hide,
        ),
      ).slice(0, 20)
    }, []),
    staleTime: 1000 * 60 * 10,
  })
  return (
    <Screen className="flex h-auto min-h-[100vh] center">
      <div className="flex min-w-0 flex-col">
        <BottomToUpTransitionView className="text-center text-3xl font-medium">
          这些是我珍视的人，他们陪伴我走过人生的每一段旅程。
        </BottomToUpTransitionView>
        <ul
          className={clsx(
            'mt-12 grid max-w-5xl grid-cols-3 gap-10 p-4 md:grid-cols-4 lg:grid-cols-5 lg:p-0',

            'min-w-0 [&>*]:flex [&>*]:flex-col [&>*]:center',
          )}
        >
          {data?.map((friend, i) => {
            return (
              <li key={friend.id} className="min-w-0 max-w-full">
                <m.div
                  initial={{ scale: 0.001, opacity: 0.0001 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: i * 0.1 + 0.3,
                    ...softBouncePreset,
                  }}
                  className="w-full min-w-0"
                >
                  <a
                    href={friend.url}
                    className="flex w-full min-w-0 flex-col center"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div
                      className="aspect-square h-[80px] w-[80px] rounded-full bg-contain bg-center ring-1 ring-slate-200/80 dark:bg-neutral-800/80"
                      style={{
                        backgroundImage: `url(${friend.avatar})`,
                      }}
                      aria-hidden
                    />
                    <span className="mt-5 w-full min-w-0 truncate text-center">
                      {friend.name}
                    </span>
                  </a>
                </m.div>
              </li>
            )
          })}
        </ul>

        <BottomToUpTransitionView
          delay={1500}
          className="mt-16 w-full text-center"
        >
          <MotionButtonBase>
            <Link
              className="shiro-link--underline"
              href={routeBuilder(Routes.Friends, {})}
            >
              还有更多，要不要看看？
            </Link>
          </MotionButtonBase>
        </BottomToUpTransitionView>
      </div>
    </Screen>
  )
}

const MoreScreen = () => {
  return null
  return (
    <Screen>
      <h2 className="text-2xl font-medium">感谢看到这里。</h2>

      <div className="mt-12 flex w-full center">TODO</div>
    </Screen>
  )
}
