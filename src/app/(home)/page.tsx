'use client'

import { useQuery } from '@tanstack/react-query'
import React, { createElement, forwardRef } from 'react'
import clsx from 'clsx'
import { m } from 'framer-motion'
import type { PropsWithChildren } from 'react'

import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { SocialIcon } from '~/components/widgets/home/SocialIcon'
import { softBouncePrest } from '~/constants/spring'
import { useConfig } from '~/hooks/data/use-config'
import { isDev } from '~/lib/env'
import { clsxm } from '~/lib/helper'
import { noopObj } from '~/lib/noop'
import { apiClient } from '~/lib/request'
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
}: {
  children:
    | [React.ReactNode, React.ReactNode]
    | [React.ReactNode, React.ReactNode, React.ReactNode]
}) => {
  return (
    <div className="relative flex h-full w-full flex-col flex-wrap items-center lg:flex-row">
      {children.slice(0, 2).map((child, i) => {
        return (
          <div
            key={i}
            className="flex h-1/2 w-full flex-col center lg:h-auto lg:w-1/2"
          >
            <div className="relative max-w-xl">{child}</div>
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
              return createElement(type, { key: i, className: t.class }, t.text)
            })}
          </m.div>

          <BottomToUpTransitionView
            delay={300}
            transition={softBouncePrest}
            className="my-3"
          >
            <span className="opacity-80">{description}</span>
          </BottomToUpTransitionView>

          <ul className="mt-8 flex space-x-4 center lg:mt-[7rem] lg:block">
            {Object.entries(socialIds || noopObj).map(
              ([type, id]: any, index) => {
                return (
                  <BottomToUpTransitionView
                    key={type}
                    delay={index * 100 + 500}
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
    <Screen>
      <TwoColumnLayout>
        <h2 className="text-2xl font-medium leading-loose">
          在这个矩阵中，你可以找到各种各样的代码块。
          <br />
          它们是我在计算机科学的探索和实践的证明。
        </h2>
        <div>
          <ul>
            {posts.map((post) => {
              return <li key={post.id}>{post.title}</li>
            })}
          </ul>
        </div>
      </TwoColumnLayout>
    </Screen>
  )
}

const NoteScreen = () => {
  const { notes } = useHomeQueryData()
  return (
    <Screen>
      <TwoColumnLayout>
        <div>
          <ul>
            {notes.map((note) => {
              return <li key={note.id}>{note.title}</li>
            })}
          </ul>
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
