'use client'

import { useQuery } from '@tanstack/react-query'
import React, { createElement, forwardRef } from 'react'
import clsx from 'clsx'
import { m } from 'framer-motion'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'

import { MotionButtonBase } from '~/components/ui/button'
import { RelativeTime } from '~/components/ui/relative-time'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { TextUpTransitionView } from '~/components/ui/transition/TextUpTransitionView'
import { isSupportIcon, SocialIcon } from '~/components/widgets/home/SocialIcon'
import { PeekLink } from '~/components/widgets/peek/PeekLink'
import { PostMetaBar } from '~/components/widgets/post'
import { softBouncePrest, softSpringPreset } from '~/constants/spring'
import { useConfig } from '~/hooks/data/use-config'
import { isDev } from '~/lib/env'
import { clsxm } from '~/lib/helper'
import { noopObj } from '~/lib/noop'
import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

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
  return (
    <div
      ref={ref}
      style={isDev ? debugStyle : undefined}
      className={clsxm(
        'relative flex h-screen flex-col center',
        props.className,
      )}
    >
      {props.children}
    </div>
  )
})
Screen.displayName = 'Screen'

export default function Home() {
  return (
    <div>
      <Screen className="mt-[-4.5rem]">
        <h1>
          这个页面还没构思，待到春去秋来，我会在这里写下一些关于我自己的故事。
        </h1>
        <h1>其他页面基本已完成。你可以在顶部的导航栏中找到它们。</h1>
        <h1>欢迎给我反馈问题，谢谢您。</h1>
      </Screen>

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
            <div className="relative max-w-full lg:max-w-xl ">{child}</div>
          </div>
        )
      })}

      {children[2]}
    </div>
  )
}

const Welcome = () => {
  const { title, description } = useConfig().hero
  const siteOwner = useAggregationSelector((agg) => agg.user)
  const { avatar, socialIds } = siteOwner || {}

  const titleAnimateD =
    title.template.reduce((acc, cur) => {
      return acc + (cur.text?.length || 0)
    }, 0) * 50
  return (
    <Screen className="mt-[-4.5rem]">
      <TwoColumnLayout>
        <>
          <m.div
            className="relative leading-[4] [&_*]:inline-block"
            initial={{ opacity: 0.0001, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={softBouncePrest}
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
            transition={softBouncePrest}
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

        <img
          src={avatar}
          alt="Site Owner Avatar"
          className={clsxm(
            'aspect-square rounded-full border border-slate-200 dark:border-neutral-800',
            'lg:h-[300px] lg:w-[300px]',
            'h-[200px] w-[200px]',
          )}
        />

        <m.div
          initial={{ opacity: 0.0001, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={softBouncePrest}
          viewport={{ once: true }}
          className={clsx(
            'absolute bottom-0 left-0 right-0 flex flex-col center',

            'text-neutral-800/80 center dark:text-neutral-200/80',
          )}
        >
          <small>
            欢迎，来到这个小小的宇宙，一个闪烁着光彩的星球，等待着你的探索。
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
    <Screen className="h-[120vh]">
      <TwoColumnLayout leftContainerClassName="h-1/4 lg:h-1/2">
        <m.h2
          initial={{
            opacity: 0.0001,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={softSpringPreset}
          className="text-2xl font-medium leading-loose"
        >
          看看最近我又在折腾啥捏
          <br />
          随便水水文章，重在折腾。
        </m.h2>
        <div>
          <ul className="space-y-4">
            {posts.map((post, i) => {
              const imageSrc = post.images?.[0]?.src

              return (
                <m.li
                  viewport={{ once: true }}
                  whileInView={{
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              ...softBouncePrest,
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
        <div>
          <section className="flex flex-col justify-end">
            <h3 className="mb-6 text-center text-xl">
              看看我的近况，这是我最近的所思所想
            </h3>
            <div
              className={clsx(
                'relative flex h-[150px] w-full rounded-md ring-1 ring-slate-200 center dark:ring-neutral-800',
                'hover:shadow-md hover:shadow-slate-100 dark:hover:shadow-neutral-900',
              )}
            >
              <Link href={routeBuilder(Routes.Note, { id: theLast.nid })}>
                <div className="absolute bottom-6 right-6 ">
                  <h4 className="font-2xl text-lg font-medium ">
                    {theLast.title}
                  </h4>

                  <small className="mt-1 block w-full text-right">
                    <RelativeTime date={theLast.created} />
                  </small>
                </div>
              </Link>

              {!!theLast.images?.[0]?.src && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    background: `url(${theLast.images[0].src})`,
                  }}
                />
              )}
            </div>
          </section>

          {hasHistory && (
            <section className="mt-[20%]">
              <div className="text-lg opacity-80">这里还有一些历史回顾</div>
              <ul className="shiro-timeline mt-4">
                {history.map((note) => {
                  return (
                    <li key={note.id} className="flex min-w-0 justify-between">
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
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        </div>
        <h2 className="text-2xl font-medium leading-loose">
          而在这里，你会看到一个不同的我，
          <br />
          一个在生活中发现美，感受痛苦，洞察人性的我。
        </h2>
      </TwoColumnLayout>
    </Screen>
  )
}

const FriendScreen = () => {
  const { data } = useQuery({
    queryKey: ['home', 'friends'],
    queryFn: async () => {
      return apiClient.friend.getAllPaginated(1, 10)
    },
    staleTime: 1000 * 60,
  })
  return (
    <Screen>
      <h2>
        这些是我珍视的人，他们陪伴我走过人生的每一段旅程，和我一起笑，一起哭，一起成长。
      </h2>
      <ul>
        {data?.data.map((friend) => {
          return <li key={friend.id}>{friend.name}</li>
        })}
      </ul>
      还有更多..
    </Screen>
  )
}

const MoreScreen = () => {
  return (
    <Screen>
      <h1>
        最后，这是关于这个小宇宙以及我自己的一些小秘密。如果你有任何问题或者想要分享的想法，都可以随时找到我。
      </h1>

      <div>Like this?</div>
    </Screen>
  )
}
